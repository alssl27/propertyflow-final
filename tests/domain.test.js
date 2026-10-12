import { test } from "node:test";
import assert from "node:assert/strict";
import {
  metrics,
  filterProperties,
  propertyErrors,
  propertyKey,
  complianceStatus,
  nextRepairStatus,
  toCsv,
  validDate,
  validateWorkspace,
} from "../assets/js/domain.js";
const p = {
  id: "p1",
  address: "12 Test Lane",
  postcode: "OL8 2AB",
  bedrooms: 2,
  rent: 950.25,
  status: "occupied",
  createdAt: "2026-10-01T12:00:00Z",
};
test("D01 rent and occupancy include occupied records only; empty portfolio is zero", () => {
  assert.deepEqual(metrics([]), {
    total: 0,
    occupied: 0,
    vacant: 0,
    maintenance: 0,
    rent: 0,
    occupancy: 0,
  });
  assert.equal(
    metrics([p, { ...p, id: "p2", status: "vacant", rent: 2000 }]).rent,
    950.25,
  );
  assert.equal(metrics([p, { ...p, status: "vacant" }]).occupancy, 50);
});
test("D02 search and status filtering compose", () => {
  assert.equal(filterProperties([p], "test", "occupied").length, 1);
  assert.equal(filterProperties([p], "ol8", "vacant").length, 0);
  assert.equal(filterProperties([p], "absent").length, 0);
});
test("D03 required fields, rent, bedrooms and enum validation", () => {
  assert.deepEqual(propertyErrors(p), {});
  for (const rent of [-1, 0, NaN, Infinity, 100001, 1.001])
    assert.ok(propertyErrors({ ...p, rent }).rent);
  assert.ok(
    propertyErrors({
      ...p,
      address: " ",
      postcode: "invalid",
      bedrooms: 0,
      status: "unknown",
    }).postcode,
  );
});
test("D04 duplicate keys ignore case and redundant whitespace", () =>
  assert.equal(
    propertyKey(p),
    propertyKey({ ...p, address: " 12  TEST lane ", postcode: "ol82ab" }),
  ));
test("D05 calendar boundaries are inclusive and reject impossible dates", () => {
  const now = new Date(2026, 9, 12, 23, 59);
  assert.equal(complianceStatus("2026-10-11", now), "overdue");
  assert.equal(complianceStatus("2026-10-12", now), "due-soon");
  assert.equal(complianceStatus("2026-11-11", now), "due-soon");
  assert.equal(complianceStatus("2026-11-12", now), "due-later");
  assert.equal(complianceStatus("2026-02-30", now), "unknown");
  assert.equal(validDate("2028-02-29"), true);
});
test("D06 repair workflow and invalid status", () => {
  assert.equal(nextRepairStatus("open"), "scheduled");
  assert.equal(nextRepairStatus("complete"), "open");
  assert.throws(() => nextRepairStatus("invented"));
});
test("D07 CSV quotes commas newlines and formula protection", () => {
  assert.equal(
    toCsv([["a,b", 'a"b', "a\nb", "=1+1"]]),
    `"a,b","a""b","a\nb","'=1+1"`,
  );
});
test("D08 schema rejects malformed, duplicate and orphaned data", () => {
  const data = { properties: [p], repairs: [], compliance: [] };
  assert.equal(validateWorkspace(data), data);
  assert.throws(() => validateWorkspace({ ...data, properties: {} }));
  assert.throws(() => validateWorkspace({ ...data, properties: [p, p] }));
  assert.throws(() =>
    validateWorkspace({
      ...data,
      compliance: [
        { id: "c", propertyId: "missing", type: "EPC", dueDate: "2027-01-01" },
      ],
    }),
  );
});
