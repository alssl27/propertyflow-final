import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
const key = "propertyflow.workspace.v2";
const evidenceDir = process.env.PLAYWRIGHT_EVIDENCE_DIR || "docs/evidence";
async function ready(page, route = "dashboard") {
  await page.goto(`/#${route}`);
  await expect(page.locator("h1")).toBeVisible();
}
async function go(page, route) {
  await page.locator(`.primary-nav [data-route="${route}"]`).click();
  await expect(page).toHaveURL(new RegExp(`#${route}$`));
}
async function workspaceFrom(page) {
  return page.evaluate(async () => {
    const api = await import("/assets/js/api.js");
    return api.getWorkspaceData();
  });
}
async function replaceIndexedWorkspace(page, value) {
  await page.evaluate(async (replacement) => {
    const api = await import("/assets/js/api.js");
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open(api.DATABASE_NAME, 1);
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
    });
    const transaction = database.transaction(api.DATABASE_STORE, "readwrite");
    transaction
      .objectStore(api.DATABASE_STORE)
      .put(replacement, api.DATABASE_KEY);
    await new Promise((resolve, reject) => {
      transaction.addEventListener("complete", resolve);
      transaction.addEventListener("abort", () => reject(transaction.error));
      transaction.addEventListener("error", () => reject(transaction.error));
    });
    database.close();
  }, value);
}
async function addProperty(page, address = "99 Fiction Lane") {
  await page.locator('[data-action="add-property"]').first().click();
  const form = page.locator("#property-form");
  await form.locator('[name="address"]').fill(address);
  await form.locator('[name="postcode"]').fill("OL8 2AB");
  await form.locator('[name="bedrooms"]').selectOption("2");
  await form.locator('[name="rent"]').fill("1250.50");
  await form.getByRole("button", { name: "Save property" }).click();
  await expect(page.locator("#property-modal")).not.toBeVisible();
}
test("B01 full property workflow, duplicates, persistence, search, delete", async ({
  page,
}) => {
  // Playwright gives each test a fresh browser context, including IndexedDB.
  // Clear localStorage migration keys as well: navigate first so the origin is
  // set, then clear, then reload to initialise a clean workspace from seeds.
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page);
  await expect(page).toHaveTitle("Dashboard | PropertyFlow");
  await addProperty(page);
  const row = page.getByRole("row").filter({ hasText: "99 Fiction Lane" });
  await expect(row).toHaveCount(1);
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await page.locator('#property-form [name="rent"]').fill("1300");
  await page.getByRole("button", { name: "Save property" }).click();
  await expect(row).toContainText("£1,300");
  await page.reload();
  await expect(row).toContainText("£1,300");
  await page.locator("#property-search").fill("nonsense");
  await page.locator("#property-search").fill("Fiction");
  await expect(page.locator("#property-results")).toContainText(
    "Showing 1 of 9",
  );
  await page.locator('[data-action="clear-property-filters"]').click();
  await addPropertyAttempt(page);
  await expect(
    page.locator('#property-form [data-error-for="address"]'),
  ).toContainText("already");
  await page.keyboard.press("Escape");
  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: /Delete/ }).click();
  await expect(row).toHaveCount(0);
  await page.screenshot({
    path: `${evidenceDir}/properties-desktop.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
async function addPropertyAttempt(page) {
  await page.locator('[data-action="add-property"]').first().click();
  const f = page.locator("#property-form");
  await f.locator('[name="address"]').fill("99 Fiction Lane");
  await f.locator('[name="postcode"]').fill("ol82ab");
  await f.locator('[name="bedrooms"]').selectOption("2");
  await f.locator('[name="rent"]').fill("1000");
  await f.getByRole("button", { name: "Save property" }).click();
}
test("B02 repairs create edit filter and lifecycle; linked deletion blocked", async ({
  page,
}) => {
  await ready(page, "repairs");
  await page.locator('[data-action="add-repair"]').first().click();
  const f = page.locator("#repair-form");
  await f.locator('[name="propertyId"]').selectOption("p-1001");
  await f.locator('[name="description"]').fill("Fictional window repair");
  await f.locator('[name="priority"]').selectOption("urgent");
  await f.getByRole("button", { name: "Save repair" }).click();
  const row = page
    .getByRole("row")
    .filter({ hasText: "Fictional window repair" });
  await expect(row).toContainText("Urgent");
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await f.locator('[name="priority"]').selectOption("emergency");
  await f.getByRole("button", { name: "Save repair" }).click();
  await expect(row).toContainText("Emergency");
  for (const status of ["Scheduled", "In progress", "Completed"]) {
    await row.getByRole("button", { name: "Update status" }).click();
    await expect(row).toContainText(status);
  }
  await row.getByRole("button", { name: "Reopen" }).click();
  await expect(row).toContainText("Open");
  await page.locator("#repair-priority-filter").selectOption("routine");
  await expect(row).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(row).toHaveCount(1);
  await page.screenshot({
    path: `${evidenceDir}/repairs-desktop.png`,
    fullPage: true,
  });
  await go(page, "properties");
  await page
    .getByRole("row")
    .filter({ hasText: "8 Manchester Street" })
    .getByRole("button", { name: /Delete/ })
    .click();
  await expect(page.locator("#toast-region")).toContainText("linked records");
});
test("B03 certificates create edit expiry filtering, reports CSV and reset", async ({
  page,
}) => {
  await ready(page, "compliance");
  await page.getByRole("button", { name: "Add certificate" }).click();
  const f = page.locator("#compliance-form");
  await f.locator('[name="propertyId"]').selectOption("p-1001");
  await f.locator('[name="type"]').fill("Fictional inspection");
  await f.locator('[name="dueDate"]').fill("2020-01-01");
  await f.getByRole("button", { name: "Save certificate" }).click();
  const row = page.getByRole("row").filter({ hasText: "Fictional inspection" });
  await expect(row).toContainText("Overdue");
  await row.getByRole("button", { name: "Edit" }).click();
  await f.locator('[name="dueDate"]').fill("2099-01-01");
  await f.getByRole("button", { name: "Save certificate" }).click();
  await expect(row).toContainText("Due later");
  await page.locator("#compliance-filter").selectOption("overdue");
  await expect(row).toHaveCount(0);
  await page.screenshot({
    path: `${evidenceDir}/compliance-desktop.png`,
    fullPage: true,
  });
  await go(page, "reports");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  const csv = await readFile(await download.path(), "utf8");
  expect(csv).toContain("Abbeyhills");
  expect(csv).toContain("Monthly rent GBP");
  await page.screenshot({
    path: `${evidenceDir}/reports-desktop.png`,
    fullPage: true,
  });
  await go(page, "settings");
  const dismissNotifications = page.getByRole("button", {
    name: "Dismiss notification",
  });
  await dismissNotifications.evaluateAll((buttons) =>
    buttons.forEach((button) => button.click()),
  );
  await expect(page.locator("#toast-region")).toBeEmpty();
  await page.screenshot({
    path: `${evidenceDir}/settings-desktop.png`,
    fullPage: true,
  });
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await expect(page).toHaveURL(/#dashboard$/);
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)).compliance.length,
      key,
    ),
  ).toBe(8);
});
test("B04 modal keyboard, validation, focus containment, history and skip link", async ({
  page,
}) => {
  await ready(page);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.locator('[data-action="add-property"]').first().click();
  await page.getByRole("button", { name: "Save property" }).click();
  await expect(page.locator('#property-form [name="address"]')).toBeFocused();
  await expect(page.locator('#property-form [name="address"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement.closest("dialog")),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(page.locator("#property-modal")).not.toBeVisible();
  await go(page, "properties");
  await go(page, "repairs");
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Properties");
  await page.goForward();
  await expect(page.locator("h1")).toHaveText("Repairs");
});
test("B05 slow fetch loading failure retry and corrupt storage recovery", async ({
  page,
}) => {
  await page.route("**/data/repairs.json", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ status: 503, body: "unavailable" });
  });
  await page.goto("/");
  await expect(page.getByText("Loading your workspace…")).toBeVisible();
  await expect(page.getByText("We couldn't load your workspace")).toBeVisible();
  await page.unroute("**/data/repairs.json");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("h1")).toBeVisible();
  await replaceIndexedWorkspace(page, "{bad");
  await page.reload();
  await expect(page.getByText("We couldn't load your workspace")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDir}/storage-error.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Open Settings to recover" }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await expect(page.locator("h1")).toContainText("portfolio");
});
test("B06 empty workspace, missing resource and custom 404", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key }) =>
      localStorage.setItem(
        key,
        JSON.stringify({ properties: [], repairs: [], compliance: [] }),
      ),
    { key },
  );
  await ready(page);
  await go(page, "reports");
  await expect(page.locator("h1")).toHaveText("Reports");
  await expect(page.locator("body")).not.toContainText("NaN");
  await page.goto("/missing/nested/path");
  await expect(
    page.getByRole("heading", { name: "We couldn't find that page" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to Dashboard" }).click();
  await expect(page.locator("h1")).toContainText("portfolio");
  expect((await page.request.get("/data/missing.json")).status()).toBe(404);
});
for (const width of [320, 375, 768, 1024, 1440])
  test(`B07 responsive ${width}px all views and accessibility scan`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await ready(page);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "dashboard",
      "properties",
      "repairs",
      "compliance",
      "reports",
      "settings",
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const scan = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        scan.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
    await page.goto("/#dashboard");
    await expect(page.locator("h1")).toBeVisible();
    await page.screenshot({
      path: `${evidenceDir}/dashboard-${width}.png`,
      fullPage: true,
    });
    if (width <= 768) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.locator('.primary-nav [data-route="properties"]').click();
      await expect(page.locator("h1")).toHaveText("Properties");
      await expect(page.locator("#menu-toggle")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    }
    expect(errors).toEqual([]);
  });

test("B08 duplicate form submit and unavailable storage retain unsaved form", async ({
  page,
}) => {
  await ready(page);
  await page.locator('[data-action="add-property"]').first().click();
  const f = page.locator("#property-form");
  await f.locator('[name="address"]').fill("77 Fiction Avenue");
  await f.locator('[name="postcode"]').fill("OL8 2AB");
  await f.locator('[name="bedrooms"]').selectOption("2");
  await f.locator('[name="rent"]').fill("1000");
  await f.evaluate((form) => {
    form.requestSubmit();
    form.requestSubmit();
  });
  await expect(page.locator("#property-modal")).not.toBeVisible();
  expect(
    (await workspaceFrom(page)).properties.filter(
      (property) => property.address === "77 Fiction Avenue",
    ).length,
  ).toBe(1);
  await page.locator('[data-action="add-property"]').first().click();
  await f.locator('[name="address"]').fill("78 Fiction Avenue");
  await f.locator('[name="postcode"]').fill("OL8 2AB");
  await f.locator('[name="bedrooms"]').selectOption("2");
  await f.locator('[name="rent"]').fill("1000");
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = () => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    };
  });
  await f.getByRole("button", { name: "Save property" }).click();
  await expect(page.locator("#toast-region")).toContainText("could not save");
  await expect(page.locator("#property-modal")).toBeVisible();
  expect((await workspaceFrom(page)).properties.length).toBe(9);
});
test("B09 IndexedDB transactions preserve two-tab writes without Web Locks", async ({
  page,
  context,
}) => {
  await context.addInitScript(() =>
    Object.defineProperty(navigator, "locks", {
      configurable: true,
      value: undefined,
    }),
  );
  await ready(page);
  const second = await context.newPage();
  await ready(second);
  expect(await page.evaluate(() => navigator.locks)).toBeUndefined();
  expect(await second.evaluate(() => navigator.locks)).toBeUndefined();
  const write = (tab, id) =>
    tab.evaluate(async (id) => {
      const api = await import("/assets/js/api.js");
      await api.addRecord("properties", {
        id,
        address: `${id} Fiction Street`,
        postcode: "OL8 2AB",
        bedrooms: 1,
        rent: 500,
        status: "vacant",
        createdAt: new Date().toISOString(),
      });
    }, id);
  const ids = [];
  for (let iteration = 0; iteration < 20; iteration += 1) {
    const firstId = `tab-one-${iteration}`;
    const secondId = `tab-two-${iteration}`;
    ids.push(firstId, secondId);
    await Promise.all([write(page, firstId), write(second, secondId)]);
  }

  const assertAllWrites = async (tab) => {
    const workspace = await workspaceFrom(tab);
    const savedIds = new Set(
      workspace.properties.map((property) => property.id),
    );
    expect(ids.every((id) => savedIds.has(id))).toBe(true);
    expect(workspace.properties).toHaveLength(8 + ids.length);
  };
  await assertAllWrites(page);
  await assertAllWrites(second);

  const third = await context.newPage();
  await ready(third);
  await assertAllWrites(third);
  await expect(page.locator("#toast-region")).toContainText("another tab");
});
test("B10 quick actions, property status/filter, notification, unknown route and modal scan", async ({
  page,
}) => {
  await ready(page);
  await page.locator("#notifications-button").click();
  await expect(page.locator("h1")).toHaveText("Compliance");
  await go(page, "dashboard");
  await page.locator('.quick-actions [data-action="add-property"]').click();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(scan.violations.map((v) => v.id)).toEqual([]);
  await page.screenshot({
    path: `${evidenceDir}/property-dialog.png`,
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await page.locator('.quick-actions [data-action="add-repair"]').click();
  await page.locator("#repair-modal [data-close]").first().click();
  await page.locator('.quick-actions [data-route="reports"]').click();
  await expect(page.locator("h1")).toHaveText("Reports");
  await go(page, "properties");
  const row = page.getByRole("row").filter({ hasText: "12 Abbeyhills Road" });
  await row.getByRole("button", { name: /Change status/ }).click();
  await expect(row).toContainText("Vacant");
  await page.locator("#property-status-filter").selectOption("vacant");
  await expect(page.locator("#property-results")).toContainText(
    "Showing 3 of 8",
  );
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#property-results")).toContainText(
    "Showing 8 of 8",
  );
  await page.goto("/#does-not-exist");
  await expect(page.locator("h1")).toContainText("portfolio");
});
