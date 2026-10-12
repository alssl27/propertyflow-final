import { validateWorkspace, nextRepairStatus } from "./domain.js";

export const STORAGE_KEY = "propertyflow.workspace.v2";
const collections = ["properties", "repairs", "compliance"];
let queue = Promise.resolve();

// One queue for ALL collections avoids a delete racing a linked-record creation.
// Web Locks extend this guarantee to cooperating tabs. Without them the queue is tab-local.
function exclusive(operation) {
  const run = () =>
    globalThis.navigator?.locks
      ? navigator.locks.request("propertyflow-workspace", operation)
      : operation();
  const pending = queue.then(run, run);
  queue = pending.catch(() => {}); // A failed task must not poison subsequent operations.
  return pending;
}
function read(key) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  } catch {
    throw new Error(
      "Saved browser data could not be read. Storage may be blocked or damaged. Retry, or reset demo data in Settings.",
    );
  }
}
function save(data) {
  validateWorkspace(data);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error(
      "Your browser could not save this change. Check storage permissions and available space.",
    );
  }
  return structuredClone(data);
}
async function fetchSeeds() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const results = await Promise.all(
      collections.map(async (name) => {
        const response = await fetch(
          new URL(`../../data/${name}.json`, import.meta.url),
          { signal: controller.signal },
        );
        if (!response.ok)
          throw new Error(
            `Starter ${name} data could not be loaded (HTTP ${response.status}).`,
          );
        return response.json();
      }),
    );
    return validateWorkspace(
      Object.fromEntries(collections.map((name, i) => [name, results[i]])),
    );
  } catch (error) {
    controller.abort();
    throw new Error(
      error.name === "AbortError"
        ? "Loading timed out. Check your connection and try again."
        : `Could not load demonstration data. ${error.message}`,
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }
}
async function load() {
  const saved = read(STORAGE_KEY);
  if (saved !== null) return structuredClone(validateWorkspace(saved));
  const legacy = Object.fromEntries(
    collections.map((name) => [name, read(`propertyflow.${name}.v1`)]),
  );
  const seed = await fetchSeeds();
  // Preserve any valid original v1 records on first use. Old keys are retained as a backup.
  for (const name of collections)
    if (legacy[name] !== null) seed[name] = legacy[name];
  for (const repair of seed.repairs)
    if (repair.status === "resolved") repair.status = "complete";
  return save(seed);
}
function checkCollection(name) {
  if (!collections.includes(name))
    throw new Error("Unknown data collection requested.");
}
export const getWorkspaceData = () => exclusive(load);
export const getCollection = (name) =>
  exclusive(async () => {
    checkCollection(name);
    return (await load())[name];
  });
export function addRecord(name, record) {
  return exclusive(async () => {
    checkCollection(name);
    const data = await load();
    if (data[name].some((item) => item.id === record.id))
      throw new Error("This record has already been saved.");
    data[name].unshift(record);
    save(data);
    return structuredClone(record);
  });
}
export function updateRecord(name, id, changes) {
  return exclusive(async () => {
    checkCollection(name);
    const data = await load();
    const index = data[name].findIndex((item) => item.id === id);
    if (index < 0)
      throw new Error("This record no longer exists. Refresh and try again.");
    const original = data[name][index];
    if (
      name === "repairs" &&
      changes.status &&
      changes.status !== original.status &&
      changes.status !== nextRepairStatus(original.status)
    )
      throw new Error(
        "Move the repair through Open → Scheduled → In progress → Completed → Open.",
      );
    const updated = {
      ...original,
      ...changes,
      id: original.id,
      createdAt: original.createdAt,
      updatedAt: new Date().toISOString(),
    };
    data[name][index] = updated;
    save(data);
    return structuredClone(updated);
  });
}
export function deleteRecord(name, id) {
  return exclusive(async () => {
    checkCollection(name);
    const data = await load();
    if (!data[name].some((item) => item.id === id))
      throw new Error("This record no longer exists. Refresh and try again.");
    if (
      name === "properties" &&
      [...data.repairs, ...data.compliance].some(
        (item) => item.propertyId === id,
      )
    )
      throw new Error(
        "This property has linked repairs or certificates. Keep it in the register to preserve those records.",
      );
    data[name] = data[name].filter((item) => item.id !== id);
    save(data);
  });
}
// Fetch and validate BEFORE the single atomic replacement. Failed resets keep saved data intact.
export const resetDemoData = () =>
  exclusive(async () => save(await fetchSeeds()));
