/**
 * PropertyFlow demo data service.
 * Reads starter data from local JSON files with fetch(), then persists changes in localStorage.
 * The small delay represents network latency so loading and async states can be observed.
 * This is a front-end simulation, not a secure production backend.
 */
const STORAGE_KEYS = {
  properties: 'propertyflow.properties.v1',
  repairs: 'propertyflow.repairs.v1',
  compliance: 'propertyflow.compliance.v1'
};
const SEED_PATHS = {
  properties: 'data/properties.json',
  repairs: 'data/repairs.json',
  compliance: 'data/compliance.json'
};
const delay = (ms = 220) => new Promise(resolve => window.setTimeout(resolve, ms));

function readStored(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  } catch (error) {
    console.error(`PropertyFlow could not read local data for ${key}.`, error);
    throw new Error('Saved browser data could not be read. Try refreshing the page or clearing this demo data.');
  }
}

function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`PropertyFlow could not save local data for ${key}.`, error);
    throw new Error('Your browser could not save this change. Check available storage and try again.');
  }
}

async function loadCollection(collection) {
  const key = STORAGE_KEYS[collection];
  const saved = readStored(key);
  if (saved !== null) return saved;
  const response = await fetch(SEED_PATHS[collection], { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Starter ${collection} data could not be loaded (HTTP ${response.status}).`);
  const records = await response.json();
  if (!Array.isArray(records)) throw new Error(`Starter ${collection} data has an unexpected format.`);
  writeStored(key, records);
  return records;
}

export async function getWorkspaceData() {
  await delay(180);
  // Parallel reads shorten total wait time compared with three sequential requests.
  const [properties, repairs, compliance] = await Promise.all([
    loadCollection('properties'), loadCollection('repairs'), loadCollection('compliance')
  ]);
  return { properties, repairs, compliance };
}

export async function getCollection(collection) {
  if (!STORAGE_KEYS[collection]) throw new Error('Unknown data collection requested.');
  await delay(120);
  return loadCollection(collection);
}

export async function addRecord(collection, record) {
  if (!STORAGE_KEYS[collection]) throw new Error('Unknown data collection requested.');
  await delay(180);
  const records = await loadCollection(collection);
  const next = [record, ...records];
  writeStored(STORAGE_KEYS[collection], next);
  return record;
}

export async function updateRecord(collection, id, changes) {
  if (!STORAGE_KEYS[collection]) throw new Error('Unknown data collection requested.');
  await delay(160);
  const records = await loadCollection(collection);
  const index = records.findIndex(record => record.id === id);
  if (index < 0) throw new Error('This record could not be found. Refresh the page and try again.');
  const updated = { ...records[index], ...changes };
  const next = [...records];
  next[index] = updated;
  writeStored(STORAGE_KEYS[collection], next);
  return updated;
}

export async function deleteRecord(collection, id) {
  if (!STORAGE_KEYS[collection]) throw new Error('Unknown data collection requested.');
  await delay(150);
  const records = await loadCollection(collection);
  const next = records.filter(record => record.id !== id);
  if (next.length === records.length) throw new Error('This record could not be found. Refresh the page and try again.');
  writeStored(STORAGE_KEYS[collection], next);
}

export async function resetDemoData() {
  Object.values(STORAGE_KEYS).forEach(key => window.localStorage.removeItem(key));
  return getWorkspaceData();
}
