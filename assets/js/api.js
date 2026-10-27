/**
 * api.js — Persistence, data loading and workspace management for PropertyFlow
 *
 * PURPOSE
 * -------
 * This module is the only place in the application that persists workspace
 * data or fetches the starter JSON files over HTTP. Browsers use IndexedDB as
 * the authoritative store so each read/modify/write can run in one transaction
 * across tabs. localStorage remains a migration/mirror layer and the fallback
 * for environments such as the Node unit tests that do not expose IndexedDB.
 *
 * The module exports a small set of named functions that the UI (app.js) calls:
 *   getWorkspaceData()          — load (or first-fetch) the full workspace
 *   getCollection(name)         — load and return one named collection
 *   addRecord(name, record)     — append a new record to a collection
 *   updateRecord(name, id, …)   — merge changes into an existing record
 *   deleteRecord(name, id)      — remove a record (with referential-integrity check)
 *   resetDemoData()             — re-download the starter JSON and replace the workspace
 *   STORAGE_KEY                 — the compatibility localStorage mirror key
 *
 * AI-ASSISTANCE RECORD
 * --------------------
 * This file was written with the help of IBM Bob (AI coding assistant).
 * The assistant was used to:
 *   • Design the promise-queue serialisation pattern (exclusive()) so that
 *     concurrent calls cannot interleave reads and writes.
 *   • Integrate Web Locks (navigator.locks.request) for cross-tab coordination
 *     with a graceful fallback to the tab-local queue where unavailable.
 *   • Implement the 15-second AbortController fetch timeout.
 *   • Implement Promise.all seed fetching that preserves collection-to-array
 *     mapping regardless of response order.
 *   • Write the legacy v1-key migration and the atomic reset-with-validation
 *     pattern.
 *   • Author inline comments, JSDoc descriptions and the test-friendly
 *     overrides used in tests/api.test.js.
 * All generated code was reviewed, tested and verified by the 16 automated
 * tests in tests/api.test.js before inclusion.
 * OpenAI Codex later replaced whole-snapshot cross-tab localStorage writes
 * with IndexedDB readwrite transactions after a repeated browser stress test
 * exposed a real lost-update race between Chromium renderer processes.
 *
 * CRITERIA ADDRESSED
 * ------------------
 * 1.3  Custom JavaScript — async/await, Promise.all, AbortController
 * 2.3  Intelligent handling of invalid/empty input (validation before save)
 * 2.4  Appropriate working functionality for all project requirements
 * 2.8  Code that does not generate internal errors (all rejections are caught)
 * Distinction: clear understanding of asynchronicity and shared-data timing
 */

// Import the schema validator and repair-lifecycle helper from the pure rules module
import { validateWorkspace, nextRepairStatus } from "./domain.js";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Compatibility key used for migration, cross-tab notification and Node tests. */
export const STORAGE_KEY = "propertyflow.workspace.v2";

/** IndexedDB identifiers are exported so browser tests can exercise recovery. */
export const DATABASE_NAME = "propertyflow";
export const DATABASE_STORE = "workspace";
export const DATABASE_KEY = "current";

/** The three top-level collection names expected in the workspace object. */
const collections = ["properties", "repairs", "compliance"];

// ─── Serialisation queue ──────────────────────────────────────────────────────

/**
 * queue — a promise that resolves when all previously queued operations finish.
 * Every new operation is chained onto the end so only one can run at a time.
 * Starting value is an already-resolved promise so the first call runs immediately.
 */
let queue = Promise.resolve();

/**
 * exclusive — wraps an async operation so it runs after all previously
 * scheduled operations complete.
 *
 * If the browser supports the Web Locks API (navigator.locks.request), the
 * lock is acquired before running the operation and released on completion.
 * This extends the serialisation guarantee to cooperating tabs in the same
 * browser profile (Distinction criterion: asynchronicity and shared data).
 *
 * If Web Locks are unavailable, the operation still runs exclusively within
 * this tab via the promise chain; users are warned in the Settings view.
 *
 * A failed operation rejects the returned promise but must not prevent
 * subsequent operations from running — the catch on line `queue = pending.catch…`
 * ensures the chain itself never becomes permanently rejected.
 *
 * @param {() => Promise<*>} operation  Async function to run exclusively.
 * @returns {Promise<*>}  Resolves with the operation's return value.
 */
function exclusive(operation) {
  // Wrap the operation so it uses Web Locks when available
  const run = () =>
    globalThis.navigator?.locks
      ? navigator.locks.request("propertyflow-workspace", operation) // acquire named lock, then run
      : operation(); // no Web Locks — run directly (tab-local queue still serialises)

  // Chain onto the end of the current queue; run regardless of whether the
  // previous operation succeeded or failed (both .then branches call run)
  const pending = queue.then(run, run);

  // Attach the next operation to `pending` but swallow its error so a failed
  // task cannot poison the chain for the next caller
  queue = pending.catch(() => {});

  return pending; // callers receive the real promise (with its rejection)
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

/**
 * read — safely reads and JSON-parses a localStorage value.
 * Returns null if the key does not exist; throws a user-friendly Error if the
 * stored value cannot be parsed (e.g. truncated or manually corrupted JSON).
 *
 * @param {string} key  localStorage key to read.
 * @returns {*|null}    Parsed value, or null if the key is absent.
 * @throws {Error}      If reading or parsing fails.
 */
function readLocal(key) {
  try {
    const value = localStorage.getItem(key); // returns null if absent
    return value === null ? null : JSON.parse(value); // parse only if present
  } catch {
    // Provide a clear, actionable error message to the user
    throw new Error(
      "Saved browser data could not be read. Storage may be blocked or damaged. Retry, or reset demo data in Settings.",
    );
  }
}

/**
 * save — validates data with validateWorkspace, then writes it atomically to
 * localStorage as a single JSON string.
 *
 * Atomicity matters: if the write throws (e.g. QuotaExceededError) the
 * workspace already in localStorage is untouched, so a failed save can never
 * leave the register in a partially-updated state.
 * A deep clone is returned so the caller's object reference cannot accidentally
 * mutate the just-saved snapshot.
 *
 * @param {object} data  Workspace object to validate and persist.
 * @returns {object}     Validated deep clone of the saved workspace.
 * @throws {Error}       If validation fails or if localStorage is full/blocked.
 */
function saveLocal(data) {
  validateWorkspace(data); // throws if any field fails schema validation
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // single atomic write
  } catch {
    // Quota or permissions error — make the cause clear to the user
    throw new Error(
      "Your browser could not save this change. Check storage permissions and available space.",
    );
  }
  return structuredClone(data); // return a deep copy so callers cannot mutate stored state
}

/** Return true only when a real IndexedDB implementation is available. */
const hasIndexedDB = () => typeof globalThis.indexedDB !== "undefined";

let databasePromise;

/** Open the single-store PropertyFlow database, creating it on first use. */
function openDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.addEventListener("upgradeneeded", () => {
        if (!request.result.objectStoreNames.contains(DATABASE_STORE))
          request.result.createObjectStore(DATABASE_STORE);
      });
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
      request.addEventListener("blocked", () =>
        reject(new Error("Browser storage is blocked by another open page.")),
      );
    }).catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

/** Convert an IndexedDB request event into an awaitable result. */
function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

/** Resolve only after every request in a transaction has committed. */
function transactionComplete(transaction) {
  return new Promise((resolve, reject) => {
    transaction.addEventListener("complete", () => resolve());
    transaction.addEventListener("abort", () =>
      reject(
        transaction.error ?? new Error("Browser storage transaction failed."),
      ),
    );
    transaction.addEventListener("error", () =>
      reject(
        transaction.error ?? new Error("Browser storage transaction failed."),
      ),
    );
  });
}

/** Map low-level IndexedDB failures to the same actionable save error used by the UI. */
function storageWriteError(error) {
  if (
    error?.name === "QuotaExceededError" ||
    error?.name === "AbortError" ||
    error?.name === "InvalidStateError" ||
    error?.name === "UnknownError" ||
    error?.name === "TransactionInactiveError"
  )
    return new Error(
      "Your browser could not save this change. Check storage permissions and available space.",
      { cause: error },
    );
  return error;
}

/**
 * Keep a compatibility snapshot for migration, storage-event notifications and
 * older browsers. IndexedDB has already committed when this runs, so a blocked
 * mirror must not turn a successful authoritative write into a false failure.
 */
function mirrorWorkspace(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // IndexedDB remains authoritative; the mirror is deliberately best effort.
  }
}

/** Read the current authoritative snapshot without modifying it. */
async function readIndexedWorkspace() {
  const database = await openDatabase();
  const transaction = database.transaction(DATABASE_STORE, "readonly");
  const completed = transactionComplete(transaction);
  const value = await requestResult(
    transaction.objectStore(DATABASE_STORE).get(DATABASE_KEY),
  );
  await completed;
  return value;
}

/** Atomically replace the authoritative snapshot, then update the mirror. */
async function saveIndexedWorkspace(data) {
  const validated = structuredClone(validateWorkspace(data));
  const database = await openDatabase();
  const transaction = database.transaction(DATABASE_STORE, "readwrite");
  const completed = transactionComplete(transaction);
  try {
    await requestResult(
      transaction.objectStore(DATABASE_STORE).put(validated, DATABASE_KEY),
    );
    await completed;
  } catch (error) {
    try {
      transaction.abort();
    } catch {
      // The transaction may already have aborted.
    }
    await completed.catch(() => {});
    throw storageWriteError(error);
  }
  mirrorWorkspace(validated);
  return structuredClone(validated);
}

// ─── JSON seed fetching ───────────────────────────────────────────────────────

/**
 * fetchSeeds — downloads all three starter JSON files concurrently and returns
 * a validated workspace object.
 *
 * Key design decisions:
 *   • Promise.all fires all three requests simultaneously; the workspace is
 *     assembled only when ALL three resolve, so the collection-to-array mapping
 *     is guaranteed regardless of response arrival order.
 *   • A single AbortController is shared across all three requests so a single
 *     failure or timeout cancels the siblings immediately.
 *   • A 15-second timeout prevents the app from hanging indefinitely on a slow
 *     or unresponsive server (Distinction: timing problems with async code).
 *   • The result is validated before being returned so invalid seed files are
 *     rejected at the boundary, not silently accepted.
 *
 * @returns {Promise<object>}  Validated workspace object from the JSON files.
 * @throws {Error}             With a specific message for timeout vs HTTP errors.
 */
async function fetchSeeds() {
  // One controller for all three requests — aborting it cancels all siblings
  const controller = new AbortController();
  // Set the 15-second timeout; the timer ID is stored so it can be cleared on success
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    // Fire all three fetches at the same time; Promise.all waits for all three
    const results = await Promise.all(
      collections.map(async (name) => {
        // Build the URL relative to this file so it works from any hosting path
        const response = await fetch(
          new URL(`../../data/${name}.json`, import.meta.url),
          { signal: controller.signal }, // share the abort signal
        );
        // Treat any non-2xx HTTP response as a failure with a clear message
        if (!response.ok)
          throw new Error(
            `Starter ${name} data could not be loaded (HTTP ${response.status}).`,
          );
        return response.json(); // parse each response body as JSON
      }),
    );
    // Zip collection names back onto the results array in their original order
    // (Promise.all preserves input order even if responses arrive out of order)
    return validateWorkspace(
      Object.fromEntries(collections.map((name, i) => [name, results[i]])),
    );
  } catch (error) {
    // Ensure any still-pending requests are cancelled before throwing
    controller.abort();
    // Give the user a specific, actionable message based on the error type
    throw new Error(
      error.name === "AbortError"
        ? "Loading timed out. Check your connection and try again." // timeout path
        : `Could not load demonstration data. ${error.message}`, // fetch or parse failure
      { cause: error }, // preserve original error for tests that inspect `.cause`
    );
  } finally {
    // Always clear the timeout so it doesn't fire after a successful fetch
    clearTimeout(timeout);
  }
}

// ─── Internal load helper ────────────────────────────────────────────────────

/**
 * initialWorkspace — reads a compatible localStorage snapshot, migrates v1 if
 * necessary, or fetches the starter JSON on first use.
 *
 * Migration path (v1 → v2):
 *   The original project stored three separate keys (propertyflow.*.v1).
 *   On first use, any valid v1 records are merged into the freshly-fetched
 *   seed data so existing fictional records are preserved.  The old keys are
 *   deliberately retained as a backup (not removed).
 *
 * @returns {Promise<object>}  Deep-cloned, validated workspace object.
 */
async function initialWorkspace() {
  const saved = readLocal(STORAGE_KEY);
  if (saved !== null) return structuredClone(validateWorkspace(saved));

  const legacy = Object.fromEntries(
    collections.map((name) => [name, readLocal(`propertyflow.${name}.v1`)]),
  );
  const seed = await fetchSeeds();
  for (const name of collections)
    if (legacy[name] !== null) seed[name] = legacy[name];
  for (const repair of seed.repairs)
    if (repair.status === "resolved") repair.status = "complete";
  return structuredClone(validateWorkspace(seed));
}

/**
 * Initialise IndexedDB exactly once. Two tabs may fetch candidates together,
 * but the readwrite transaction serialises their final get/put decision: the
 * second transaction keeps the snapshot committed by the first.
 */
async function ensureIndexedWorkspace() {
  const existing = await readIndexedWorkspace();
  if (existing !== undefined)
    return structuredClone(validateWorkspace(existing));

  const candidate = await initialWorkspace();
  const database = await openDatabase();
  const transaction = database.transaction(DATABASE_STORE, "readwrite");
  const completed = transactionComplete(transaction);
  const store = transaction.objectStore(DATABASE_STORE);
  try {
    const current = await requestResult(store.get(DATABASE_KEY));
    const selected =
      current === undefined
        ? structuredClone(validateWorkspace(candidate))
        : structuredClone(validateWorkspace(current));
    if (current === undefined)
      await requestResult(store.put(selected, DATABASE_KEY));
    await completed;
    mirrorWorkspace(selected);
    return structuredClone(selected);
  } catch (error) {
    try {
      transaction.abort();
    } catch {
      // The transaction may already have aborted.
    }
    await completed.catch(() => {});
    throw storageWriteError(error);
  }
}

/** Load from IndexedDB in browsers, or the localStorage fallback elsewhere. */
async function load() {
  if (hasIndexedDB()) return ensureIndexedWorkspace();
  const saved = readLocal(STORAGE_KEY);
  if (saved !== null) return structuredClone(validateWorkspace(saved));
  return saveLocal(await initialWorkspace());
}

/**
 * Run a synchronous workspace mutation inside one IndexedDB readwrite
 * transaction. IndexedDB queues those transactions across tabs, so every
 * mutator reads the previous committed value before it writes the next one.
 */
async function mutateWorkspace(mutator) {
  if (!hasIndexedDB()) {
    const data = await load();
    const result = mutator(data);
    saveLocal(data);
    return structuredClone(result);
  }

  await ensureIndexedWorkspace();
  const database = await openDatabase();
  const transaction = database.transaction(DATABASE_STORE, "readwrite");
  const completed = transactionComplete(transaction);
  const store = transaction.objectStore(DATABASE_STORE);
  let data;
  let result;
  try {
    data = structuredClone(
      validateWorkspace(await requestResult(store.get(DATABASE_KEY))),
    );
    result = mutator(data);
    validateWorkspace(data);
    await requestResult(store.put(data, DATABASE_KEY));
    await completed;
  } catch (error) {
    try {
      transaction.abort();
    } catch {
      // The transaction may already have aborted.
    }
    await completed.catch(() => {});
    throw storageWriteError(error);
  }
  mirrorWorkspace(data);
  return structuredClone(result);
}

/** Replace the workspace using the strongest storage mechanism available. */
async function saveWorkspace(data) {
  return hasIndexedDB() ? saveIndexedWorkspace(data) : saveLocal(data);
}

// ─── Internal guard ──────────────────────────────────────────────────────────

/**
 * checkCollection — throws if name is not one of the three known collections.
 * Used as a defensive guard at the top of every exported mutating function
 * so typos in callers surface immediately rather than silently doing nothing.
 *
 * @param {string} name  Collection name to validate.
 * @throws {Error}       If name is not in the collections array.
 */
function checkCollection(name) {
  if (!collections.includes(name))
    throw new Error("Unknown data collection requested.");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * getWorkspaceData — returns the full, validated workspace object.
 * All three collections are present and schema-valid on success.
 * Runs inside the exclusive queue to prevent concurrent first-load races.
 */
export const getWorkspaceData = () => exclusive(load);

/**
 * getCollection — returns a single named collection array.
 * Validates the name and runs inside the exclusive queue.
 *
 * @param {string} name  One of "properties", "repairs", "compliance".
 * @returns {Promise<object[]>}
 */
export const getCollection = (name) =>
  exclusive(async () => {
    checkCollection(name); // guard against invalid names
    return (await load())[name]; // load workspace and pluck the collection
  });

/**
 * addRecord — appends a new record to the named collection and saves.
 *
 * Duplicate-ID detection is performed inside the queue, after loading the
 * current state, so concurrent calls from two tabs cannot both insert a
 * record with the same id (tests A07 and A09 verify this).
 *
 * @param {string} name    Collection to add to.
 * @param {object} record  Complete record object including `id`.
 * @returns {Promise<object>}  Deep clone of the saved record.
 * @throws {Error}  If a record with the same id already exists.
 */
export function addRecord(name, record) {
  return exclusive(() =>
    mutateWorkspace((data) => {
      checkCollection(name); // reject unknown collection names
      // Reject if a record with this id is already present (idempotency guard)
      if (data[name].some((item) => item.id === record.id))
        throw new Error("This record has already been saved.");
      data[name].unshift(record); // prepend so newest records appear at the top
      return record;
    }),
  );
}

/**
 * updateRecord — merges `changes` into the record identified by `id` in the
 * named collection, then saves.
 *
 * Repair-status transitions are enforced: the status must advance exactly one
 * step in the defined cycle.  This prevents the UI from jumping a repair
 * directly from Open to Completed, for example.
 *
 * The `id` and `createdAt` fields of the original record are always preserved;
 * callers cannot overwrite them through changes.  An `updatedAt` timestamp is
 * added automatically.
 *
 * @param {string} name     Collection name.
 * @param {string} id       Record id to update.
 * @param {object} changes  Partial object of fields to merge.
 * @returns {Promise<object>}  Deep clone of the updated record.
 * @throws {Error}  If the record is not found, or the repair-status transition is invalid.
 */
export function updateRecord(name, id, changes) {
  return exclusive(() =>
    mutateWorkspace((data) => {
      checkCollection(name); // guard against unknown names
      const index = data[name].findIndex((item) => item.id === id); // find the record
      // Throw if the record has been deleted since the UI last rendered
      if (index < 0)
        throw new Error("This record no longer exists. Refresh and try again.");

      const original = data[name][index]; // keep the original for comparison

      // Repairs can only advance one step at a time through the lifecycle
      if (
        name === "repairs" && // only applies to repairs
        changes.status && // a status change is being requested
        changes.status !== original.status && // it is actually a change
        changes.status !== nextRepairStatus(original.status) // it is not the next step
      )
        throw new Error(
          "Move the repair through Open → Scheduled → In progress → Completed → Open.",
        );

      // Merge changes onto the original; lock down id and createdAt, stamp updatedAt
      const updated = {
        ...original, // start with all existing fields
        ...changes, // overwrite with requested changes
        id: original.id, // id can never be changed
        createdAt: original.createdAt, // creation timestamp can never be changed
        updatedAt: new Date().toISOString(), // record when the update was made
      };
      data[name][index] = updated; // replace in-place (preserves array order)
      return updated;
    }),
  );
}

/**
 * deleteRecord — removes the record identified by `id` from the named
 * collection, with referential-integrity protection for properties.
 *
 * A property cannot be deleted if any repair or compliance record still
 * references it via propertyId.  This keeps the register consistent and
 * prevents orphaned records.
 *
 * @param {string} name  Collection name.
 * @param {string} id    Record id to delete.
 * @returns {Promise<void>}
 * @throws {Error}  If the record is not found, or the property has linked records.
 */
export function deleteRecord(name, id) {
  return exclusive(() =>
    mutateWorkspace((data) => {
      checkCollection(name); // guard unknown names

      // Confirm the record still exists (it might have been deleted in another tab)
      if (!data[name].some((item) => item.id === id))
        throw new Error("This record no longer exists. Refresh and try again.");

      // Properties: block deletion if any repair or compliance record references this id
      if (
        name === "properties" &&
        [...data.repairs, ...data.compliance].some(
          (item) => item.propertyId === id,
        )
      )
        throw new Error(
          "This property has linked repairs or certificates. Keep it in the register to preserve those records.",
        );

      // Remove the matching record and save the updated workspace
      data[name] = data[name].filter((item) => item.id !== id);
    }),
  );
}

/**
 * resetDemoData — downloads and validates the starter JSON, then replaces the
 * entire saved workspace atomically.
 *
 * The fetch-then-validate-then-save ordering is deliberate: if the download
 * fails, or if the downloaded data fails validation, the existing workspace is
 * untouched.  The saved data is only replaced on a fully successful operation
 * (test A03 verifies this).
 *
 * @returns {Promise<object>}  The newly saved workspace (deep clone).
 * @throws {Error}  If the fetch, validation or save fails.
 */
export const resetDemoData = () =>
  exclusive(async () => saveWorkspace(await fetchSeeds())); // fetch first, save only on success
