/**
 * domain.js — Pure business rules for PropertyFlow
 *
 * PURPOSE
 * -------
 * This module contains every rule that is independent of the browser, the DOM
 * and localStorage.  Because none of these functions touch the outside world
 * they can be imported by both the UI (app.js) and the Node unit-test suite
 * (tests/domain.test.js) without any mocking.
 *
 * AI-ASSISTANCE RECORD
 * --------------------
 * This file was written with the help of IBM Bob (AI coding assistant).
 * The assistant was used to:
 *   • Design the validation logic for postcodes, rent ranges and bedroom counts.
 *   • Implement the calendar-day compliance-status calculation that correctly
 *     handles daylight-saving boundaries by using UTC midnight comparisons.
 *   • Derive the CSV injection-protection logic (formula prefix escaping).
 *   • Write the validateWorkspace schema checker used by api.js and the tests.
 *   • Author inline comments and JSDoc descriptions throughout.
 * All generated code was reviewed, tested and confirmed to match the assessed
 * requirements before inclusion.  The 24 automated unit tests in
 * tests/domain.test.js and tests/api.test.js independently verify the logic.
 *
 * CRITERIA ADDRESSED
 * ------------------
 * 1.3 Custom JavaScript with significant interactive functionality
 * 2.2 Compound statements — if-statements, loops, array methods
 * 2.3 Intelligent handling of empty or invalid input data
 * 2.6 Readability — comments, indentation, meaningful names
 * 3.2 Automated testing procedures (see tests/domain.test.js)
 */

// ─── Allowed enumeration values ──────────────────────────────────────────────

/** All valid occupancy statuses for a property record. */
export const propertyStatuses = ["occupied", "vacant", "maintenance"];

/** All valid lifecycle statuses for a repair record. */
export const repairStatuses = ["open", "scheduled", "in-progress", "complete"];

/** All valid priority levels for a repair record. */
export const priorities = ["emergency", "urgent", "routine"];

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * normalise — strips leading/trailing whitespace, collapses internal runs of
 * whitespace to a single space, and lower-cases the result.
 * Used to make string comparisons case- and whitespace-insensitive.
 *
 * @param {*} value  Any value; non-strings are coerced with String().
 * @returns {string} Normalised string.
 */
const normalise = (value) =>
  String(value ?? "") // convert null/undefined to empty string, then to string
    .trim() // remove leading and trailing whitespace
    .replace(/\s+/g, " ") // collapse internal whitespace runs to one space
    .toLowerCase(); // make case-insensitive

// ─── Duplicate-detection key ─────────────────────────────────────────────────

/**
 * propertyKey — produces a canonical deduplication key for a property.
 * Two properties with the same address and postcode (ignoring case and
 * whitespace) will produce identical keys, allowing the UI and persistence
 * layer to detect duplicates before saving.
 *
 * The postcode has ALL spaces removed so "OL8 2AB" and "OL82AB" match.
 *
 * @param {{ address: string, postcode: string }} record
 * @returns {string}  e.g. "12 abbeyhills road|ol82ab"
 */
export const propertyKey = (record) =>
  // Normalise the address, then append a pipe and the normalised postcode
  // with every remaining space removed so format variants collapse together.
  `${normalise(record.address)}|${normalise(record.postcode).replace(/\s/g, "")}`;

// ─── Property validation ──────────────────────────────────────────────────────

/**
 * propertyErrors — validates every editable field of a property record.
 * Returns an object whose keys are field names and values are error messages.
 * An empty object means the record is valid.
 *
 * Validation rules (assessment criteria 2.3 — input data validation):
 *   address   : string, 4–120 characters after trimming
 *   postcode  : matches UK postcode regex (GIR 0AA or standard format)
 *   bedrooms  : integer 1–5
 *   rent      : finite number £1–£100,000 with at most two decimal places
 *   status    : one of the allowed propertyStatuses values
 *
 * @param {object} record  Candidate property object (may be partial/invalid).
 * @returns {{ [field: string]: string }}  Map of field name → error message.
 */
export function propertyErrors(record) {
  const errors = {}; // accumulate field-level error messages here

  // Address: must be a string of 4–120 characters (not just whitespace)
  if (
    typeof record.address !== "string" || // reject non-strings
    record.address.trim().length < 4 || // reject too-short values
    record.address.length > 120 // reject values that exceed the DB column
  )
    errors.address = "Enter an address of 4–120 characters.";

  // Postcode: must match the standard UK postcode format.
  // GIR 0AA is the special-case postcode for Girobank.
  // The main pattern covers 1–2 letter area codes, numeric districts,
  // optional sector letters, a mandatory sector digit and two-letter inward.
  if (
    !/^(GIR\s?0AA|[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})$/i.test(
      record.postcode ?? "", // treat missing postcode as empty string
    )
  )
    errors.postcode = "Enter a UK-style postcode, for example OL8 2AB.";

  // Bedrooms: must be a whole number (not a float) between 1 and 5 inclusive
  if (
    !Number.isInteger(record.bedrooms) || // rejects 2.5, NaN, strings etc.
    record.bedrooms < 1 || // minimum property size
    record.bedrooms > 5 // maximum size for this portfolio prototype
  )
    errors.bedrooms = "Choose a bedroom count.";

  // Rent: must be a finite number £1–£100,000 with at most two decimal places.
  // The decimal-precision check multiplies by 100 and compares to its rounded
  // value; a tolerance of 0.00001 absorbs floating-point representation noise.
  if (
    !Number.isFinite(record.rent) || // rejects NaN, Infinity, strings
    record.rent < 1 || // minimum rent
    record.rent > 100000 || // maximum rent
    Math.abs(record.rent * 100 - Math.round(record.rent * 100)) > 0.00001 // more than 2dp
  )
    errors.rent =
      "Enter monthly rent from £1 to £100,000, with at most two decimal places.";

  // Status: must be one of the three allowed values
  if (!propertyStatuses.includes(record.status))
    errors.status = "Choose an occupancy status.";

  return errors; // empty object = valid; any keys = invalid with messages
}

// ─── Property search and filter ──────────────────────────────────────────────

/**
 * filterProperties — returns the subset of records that match both a text
 * query and an optional status filter.
 *
 * The text query searches across address, postcode AND bedroom count so users
 * can type "3 bed" or a postcode partial and find results.
 * Both the query and the field values are normalised before comparison so the
 * search is case- and whitespace-insensitive.
 *
 * @param {object[]} records  Full array of property objects.
 * @param {string}   query    Free-text search string (empty string = no filter).
 * @param {string}   status   Status to filter by, or "all" for no filter.
 * @returns {object[]}        Filtered subset of records.
 */
export function filterProperties(records, query = "", status = "all") {
  const q = normalise(query); // normalise once, compare many times
  return records.filter(
    (p) =>
      // Include this record only if BOTH conditions are true:
      (!q || // if query is empty, skip text check; otherwise…
        normalise(`${p.address} ${p.postcode} ${p.bedrooms}`).includes(q)) && // …text must match
      (status === "all" || p.status === status), // status must match (or "all")
  );
}

// ─── Portfolio metrics ────────────────────────────────────────────────────────

/**
 * metrics — derives key-number summaries from the full property array.
 * Called by renderDashboard() and renderReports() to produce the stat cards
 * and bar charts without duplicating the calculation logic.
 *
 * All figures are calculated from the current register; no historical data
 * is stored or invented.
 *
 * @param {object[]} properties  Full array of property objects.
 * @returns {{ total, occupied, vacant, maintenance, occupancy, rent }}
 */
export function metrics(properties) {
  const total = properties.length; // total number of registered properties
  // Filter once and reuse the occupied array for both count and rent total
  const occupied = properties.filter((p) => p.status === "occupied");
  return {
    total,
    occupied: occupied.length, // number of occupied properties
    vacant: properties.filter((p) => p.status === "vacant").length, // vacant count
    maintenance: properties.filter((p) => p.status === "maintenance").length, // maintenance count
    // Occupancy percentage: avoid divide-by-zero when portfolio is empty
    occupancy: total ? Math.round((occupied.length / total) * 100) : 0,
    // Monthly rent roll: sum rent for occupied properties only, rounded to 2dp
    rent: Math.round(occupied.reduce((sum, p) => sum + p.rent, 0) * 100) / 100,
  };
}

// ─── Date utilities ───────────────────────────────────────────────────────────

/**
 * validDate — checks that a string is a real calendar date in YYYY-MM-DD format.
 * The regex ensures the format; the Date round-trip rejects impossible dates
 * like "2026-02-30" (February 30 does not exist).
 *
 * @param {string} value  Candidate date string.
 * @returns {boolean}
 */
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false; // format check first
  const date = new Date(`${value}T00:00:00Z`); // parse as midnight UTC
  // If the date is invalid OR rounds back to a different string, the date is impossible
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/**
 * complianceStatus — classifies a certificate's expiry date relative to today.
 *
 * Uses UTC midnight for both dates so that daylight-saving time changes cannot
 * shift a deadline by an hour and produce the wrong status on a boundary day.
 *
 * Status rules:
 *   overdue   — expiry is before today's calendar date
 *   due-soon  — expiry is today, or within the next 30 calendar days
 *   due-later — expiry is more than 30 calendar days away
 *   unknown   — dueDate is missing or not a valid date
 *
 * @param {string} dueDate  ISO date string "YYYY-MM-DD".
 * @param {Date}   today    Reference date (defaults to now; injectable for tests).
 * @returns {"overdue"|"due-soon"|"due-later"|"unknown"}
 */
export function complianceStatus(dueDate, today = new Date()) {
  if (!validDate(dueDate)) return "unknown"; // guard against invalid input

  // Build a UTC midnight timestamp for today to eliminate local time offsets
  const date = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  // Calculate the difference in whole calendar days (positive = future)
  const days = (Date.parse(`${dueDate}T00:00:00Z`) - date.getTime()) / 86400000;

  // Classify: negative = overdue, 0–30 = due soon, > 30 = due later
  return days < 0 ? "overdue" : days <= 30 ? "due-soon" : "due-later";
}

// ─── Repair lifecycle ─────────────────────────────────────────────────────────

/**
 * nextRepairStatus — returns the status that follows the given one in the
 * defined workflow cycle: open → scheduled → in-progress → complete → open.
 *
 * Throwing on an unknown status is intentional defensive design: if the UI
 * or a test passes an unrecognised value the error surfaces immediately
 * rather than silently doing nothing (criterion 2.3).
 *
 * @param {string} status  Current repair status.
 * @returns {string}       Next status in the cycle.
 * @throws {Error}         If status is not in the repairStatuses array.
 */
export function nextRepairStatus(status) {
  const index = repairStatuses.indexOf(status); // find position in the cycle
  if (index < 0) throw new Error("Unknown repair status."); // defensive guard
  // Modulo wraps "complete" (index 3) back around to "open" (index 0)
  return repairStatuses[(index + 1) % repairStatuses.length];
}

// ─── CSV generation ───────────────────────────────────────────────────────────

/**
 * csvCell — wraps a single cell value in double quotes and escapes it for safe
 * use in a CSV file.
 *
 * Two protections are applied:
 *   1. Spreadsheet formula injection: any value whose first non-space character
 *      is =, +, @, -, tab, carriage-return or newline is prefixed with a single
 *      quote so spreadsheet applications (Excel, Google Sheets) treat it as
 *      text rather than executing it as a formula.
 *   2. Quote escaping: existing double-quote characters are doubled ("") per
 *      the RFC 4180 CSV standard.
 *
 * @param {*} value  Any cell value; non-strings are coerced with String().
 * @returns {string} Double-quoted, safe CSV cell string.
 */
export function csvCell(value) {
  let text = String(value ?? ""); // coerce null/undefined to empty string
  // Prefix with apostrophe to neutralise spreadsheet formula characters
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  // Wrap in double quotes, doubling any existing double quotes inside
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * toCsv — converts a two-dimensional array of values into a RFC 4180 CSV
 * string with Windows-style CRLF line endings (required by the standard and
 * expected by Excel).
 *
 * @param {Array<Array<*>>} rows  Array of row arrays; each inner array is one row.
 * @returns {string}  Complete CSV string suitable for download as a .csv file.
 */
export const toCsv = (rows) =>
  // Map each row to a comma-joined string of escaped cells, then join rows with CRLF
  rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

// ─── Schema validation ────────────────────────────────────────────────────────

/**
 * validateWorkspace — validates the entire workspace object before it is
 * saved to or read from localStorage.
 *
 * Checks performed:
 *   • All three collections (properties, repairs, compliance) exist and are arrays.
 *   • Every record in every collection has a non-empty, non-duplicate string id.
 *   • Every property passes propertyErrors() and has a parseable createdAt date.
 *   • No two properties share the same address+postcode key.
 *   • Every repair and compliance record references a valid propertyId.
 *   • Every repair has a valid description, priority, status and createdAt.
 *   • Every compliance record has a valid certificate name and expiry date.
 *
 * Throws a descriptive Error on any violation so api.js can catch it and
 * surface a recovery message to the user (criterion 2.3, 2.8).
 *
 * @param {object} data  Candidate workspace object from JSON or localStorage.
 * @returns {object}     The same data object if valid (allows chaining).
 * @throws {Error}       With a human-readable message on any schema violation.
 */
export function validateWorkspace(data) {
  // Check each collection exists and is an array; collect unique IDs
  for (const name of ["properties", "repairs", "compliance"]) {
    if (!Array.isArray(data?.[name]))
      // data might be null/undefined
      throw new Error(
        `Invalid ${name} collection. Use Settings to reset demonstration data.`,
      );
    const ids = new Set(); // track IDs seen so far in this collection
    for (const record of data[name]) {
      if (
        !record || // record must be a non-null object
        typeof record.id !== "string" || // id must be a string
        !record.id || // id must not be empty
        ids.has(record.id) // id must be unique within its collection
      )
        throw new Error(`Invalid or duplicate ${name} ID.`);
      ids.add(record.id); // mark this id as seen
    }
  }

  // Validate each property's field values and uniqueness key
  const keys = new Set(); // track address+postcode combinations
  for (const p of data.properties) {
    if (
      Object.keys(propertyErrors(p)).length || // any validation error
      !Number.isFinite(Date.parse(p.createdAt)) // createdAt must be a parseable date
    )
      throw new Error(
        "Invalid saved property details. Reset demonstration data to recover.",
      );
    if (keys.has(propertyKey(p)))
      // duplicate address+postcode
      throw new Error(
        "This address and postcode already exist in the register.",
      );
    keys.add(propertyKey(p)); // mark this key as seen
  }

  // All repair and compliance records must reference an existing property
  for (const r of [...data.repairs, ...data.compliance]) {
    if (!data.properties.some((p) => p.id === r.propertyId))
      throw new Error(
        "A linked property is missing. Restore or reset demonstration data.",
      );
  }

  // Validate each repair's specific fields
  for (const r of data.repairs) {
    if (
      typeof r.description !== "string" || // description must be a string
      r.description.trim().length < 6 || // at least 6 meaningful characters
      r.description.length > 180 || // maximum length
      !priorities.includes(r.priority) || // priority must be in the allowed list
      !repairStatuses.includes(r.status) || // status must be in the allowed list
      !Number.isFinite(Date.parse(r.createdAt)) // createdAt must be a parseable date
    )
      throw new Error(
        "Invalid repair details. Check the description, priority and status.",
      );
  }

  // Validate each compliance record's specific fields
  for (const c of data.compliance) {
    if (
      typeof c.type !== "string" || // type must be a string
      c.type.trim().length < 3 || // at least 3 characters (e.g. "EPC")
      c.type.length > 120 || // maximum length
      !validDate(c.dueDate) // expiry must be a real calendar date
    )
      throw new Error("Enter a certificate name and a valid expiry date.");
  }

  return data; // return the validated object so callers can chain: save(validateWorkspace(data))
}
