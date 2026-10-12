/** Pure business rules shared by the UI, persistence boundary and tests. */
export const propertyStatuses = ['occupied', 'vacant', 'maintenance'];
export const repairStatuses = ['open', 'scheduled', 'in-progress', 'complete'];
export const priorities = ['emergency', 'urgent', 'routine'];
const normalise = value => String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
export const propertyKey = record => `${normalise(record.address)}|${normalise(record.postcode).replace(/\s/g, '')}`;
export function propertyErrors(record) {
  const errors = {};
  if (typeof record.address !== 'string' || record.address.trim().length < 4 || record.address.length > 120) errors.address = 'Enter an address of 4–120 characters.';
  if (!/^(GIR\s?0AA|[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})$/i.test(record.postcode ?? '')) errors.postcode = 'Enter a UK-style postcode, for example OL8 2AB.';
  if (!Number.isInteger(record.bedrooms) || record.bedrooms < 1 || record.bedrooms > 5) errors.bedrooms = 'Choose a bedroom count.';
  if (!Number.isFinite(record.rent) || record.rent < 1 || record.rent > 100000 || Math.abs(record.rent * 100 - Math.round(record.rent * 100)) > 0.00001) errors.rent = 'Enter monthly rent from £1 to £100,000, with at most two decimal places.';
  if (!propertyStatuses.includes(record.status)) errors.status = 'Choose an occupancy status.';
  return errors;
}
export function filterProperties(records, query = '', status = 'all') {
  const q = normalise(query);
  return records.filter(p => (!q || normalise(`${p.address} ${p.postcode} ${p.bedrooms}`).includes(q)) && (status === 'all' || p.status === status));
}
export function metrics(properties) {
  const total = properties.length;
  const occupied = properties.filter(p => p.status === 'occupied');
  return { total, occupied: occupied.length, vacant: properties.filter(p => p.status === 'vacant').length,
    maintenance: properties.filter(p => p.status === 'maintenance').length,
    occupancy: total ? Math.round(occupied.length / total * 100) : 0,
    rent: Math.round(occupied.reduce((sum, p) => sum + p.rent, 0) * 100) / 100 };
}
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function complianceStatus(dueDate, today = new Date()) {
  if (!validDate(dueDate)) return 'unknown';
  // Compare calendar days, not 24-hour local intervals: daylight saving cannot shift a deadline.
  const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const days = (Date.parse(`${dueDate}T00:00:00Z`) - date.getTime()) / 86400000;
  return days < 0 ? 'overdue' : days <= 30 ? 'due-soon' : 'due-later';
}
export function nextRepairStatus(status) {
  const index = repairStatuses.indexOf(status);
  if (index < 0) throw new Error('Unknown repair status.');
  return repairStatuses[(index + 1) % repairStatuses.length];
}
export function csvCell(value) {
  let text = String(value ?? '');
  // Neutralise spreadsheet formulas, as well as escaping quotes, commas and line breaks.
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
export const toCsv = rows => rows.map(row => row.map(csvCell).join(',')).join('\r\n');
export function validateWorkspace(data) {
  for (const name of ['properties', 'repairs', 'compliance']) {
    if (!Array.isArray(data?.[name])) throw new Error(`Invalid ${name} collection. Use Settings to reset demonstration data.`);
    const ids = new Set();
    for (const record of data[name]) {
      if (!record || typeof record.id !== 'string' || !record.id || ids.has(record.id)) throw new Error(`Invalid or duplicate ${name} ID.`);
      ids.add(record.id);
    }
  }
  const keys = new Set();
  for (const p of data.properties) {
    if (Object.keys(propertyErrors(p)).length || !Number.isFinite(Date.parse(p.createdAt))) throw new Error('Invalid saved property details. Reset demonstration data to recover.');
    if (keys.has(propertyKey(p))) throw new Error('This address and postcode already exist in the register.');
    keys.add(propertyKey(p));
  }
  for (const r of [...data.repairs, ...data.compliance]) {
    if (!data.properties.some(p => p.id === r.propertyId)) throw new Error('A linked property is missing. Restore or reset demonstration data.');
  }
  for (const r of data.repairs) {
    if (typeof r.description !== 'string' || r.description.trim().length < 6 || r.description.length > 180 || !priorities.includes(r.priority) || !repairStatuses.includes(r.status) || !Number.isFinite(Date.parse(r.createdAt))) throw new Error('Invalid repair details. Check the description, priority and status.');
  }
  for (const c of data.compliance) {
    if (typeof c.type !== 'string' || c.type.trim().length < 3 || c.type.length > 120 || !validDate(c.dueDate)) throw new Error('Enter a certificate name and a valid expiry date.');
  }
  return data;
}
