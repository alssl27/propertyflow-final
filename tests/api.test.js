import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  getWorkspaceData,
  addRecord,
  updateRecord,
  deleteRecord,
  resetDemoData,
  STORAGE_KEY,
} from "../assets/js/api.js";
let memory;
beforeEach(() => {
  memory = new Map();
  globalThis.localStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  };
  globalThis.fetch = async (url) => ({
    ok: true,
    json: async () => JSON.parse(await readFile(url, "utf8")),
  });
});
const property = (id) => ({
  id,
  address: `${id} Fiction Lane`,
  postcode: "OL8 2AB",
  bedrooms: 2,
  rent: 1000,
  status: "vacant",
  createdAt: new Date().toISOString(),
});
test("A01 overlapping first-load writes retain every record", async () => {
  await Promise.all([
    getWorkspaceData(),
    ...Array.from({ length: 12 }, (_, i) =>
      addRecord("properties", property(`test-${i}`)),
    ),
  ]);
  assert.equal((await getWorkspaceData()).properties.length, 20);
});
test("A02 failed fetch rejects; next request retries successfully", async () => {
  const original = fetch;
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(getWorkspaceData(), /503/);
  assert.equal(memory.has(STORAGE_KEY), false);
  globalThis.fetch = original;
  assert.equal((await getWorkspaceData()).properties.length, 8);
});
test("A03 failed reset preserves existing saved snapshot", async () => {
  await getWorkspaceData();
  const before = memory.get(STORAGE_KEY);
  globalThis.fetch = async () => {
    throw new Error("offline");
  };
  await assert.rejects(resetDemoData());
  assert.equal(memory.get(STORAGE_KEY), before);
});
test("A04 corrupt saved JSON rejects and reset can recover", async () => {
  memory.set(STORAGE_KEY, "{broken");
  await assert.rejects(getWorkspaceData(), /could not be read/);
  assert.equal((await resetDemoData()).properties.length, 8);
});
test("A05 failed storage write never returns success", async () => {
  await getWorkspaceData();
  const before = memory.get(STORAGE_KEY);
  localStorage.setItem = () => {
    throw new Error("quota");
  };
  await assert.rejects(
    addRecord("properties", property("quota")),
    /could not save/,
  );
  assert.equal(memory.get(STORAGE_KEY), before);
});
test("A06 linked certificates and repairs block deletion", async () => {
  await getWorkspaceData();
  await assert.rejects(deleteRecord("properties", "p-1003"), /linked/);
  await assert.rejects(deleteRecord("properties", "p-1001"), /linked/);
});
test("A07 simultaneous duplicate submissions save once", async () => {
  const result = await Promise.allSettled([
    addRecord("properties", property("same")),
    addRecord("properties", property("same")),
  ]);
  assert.equal(result.filter((x) => x.status === "fulfilled").length, 1);
});
test("A08 missing records and invalid transitions reject; valid edit succeeds", async () => {
  await assert.rejects(
    updateRecord("repairs", "r-104", { status: "complete" }),
    /Move the repair/,
  );
  await assert.rejects(
    updateRecord("properties", "missing", {}),
    /no longer exists/,
  );
  assert.equal(
    (await updateRecord("repairs", "r-104", { status: "scheduled" })).status,
    "scheduled",
  );
});
test("A09 empty seed datasets are valid", async () => {
  globalThis.fetch = async () => ({ ok: true, json: async () => [] });
  assert.deepEqual(await getWorkspaceData(), {
    properties: [],
    repairs: [],
    compliance: [],
  });
});
test("A10 malformed response rejects without partial persistence", async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ unexpected: 1 }),
  });
  await assert.rejects(getWorkspaceData());
  assert.equal(memory.has(STORAGE_KEY), false);
});
test("A11 legacy data migrates without destroying old keys", async () => {
  memory.set(
    "propertyflow.properties.v1",
    JSON.stringify([property("legacy")]),
  );
  memory.set("propertyflow.repairs.v1", "[]");
  memory.set("propertyflow.compliance.v1", "[]");
  assert.equal((await getWorkspaceData()).properties[0].id, "legacy");
  assert.ok(memory.has("propertyflow.properties.v1"));
});
test("A12 queued cross-collection deletion cannot create orphans", async () => {
  await addRecord("properties", property("fresh"));
  const results = await Promise.allSettled([
    deleteRecord("properties", "fresh"),
    addRecord("repairs", {
      id: "new-r",
      propertyId: "fresh",
      description: "Broken tap",
      priority: "routine",
      status: "open",
      createdAt: new Date().toISOString(),
    }),
  ]);
  assert.equal(results[0].status, "fulfilled");
  assert.equal(results[1].status, "rejected");
});
