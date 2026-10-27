import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const baseURL = process.env.BASE_URL;
if (!baseURL)
  throw new Error("Set BASE_URL to the verified PropertyFlow origin.");
const evidence = "docs/evidence/accessibility";
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const checks = [];
try {
  const context = await browser.newContext({
    viewport: { width: 375, height: 1000 },
    reducedMotion: "reduce",
    forcedColors: "active",
  });
  const page = await context.newPage();
  const uncaughtErrors = [];
  page.on("pageerror", (error) => uncaughtErrors.push(error.message));
  await page.goto(`${baseURL}/#dashboard`);
  await page.locator("h1").waitFor();
  assert.equal(
    await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
    true,
  );
  assert.equal(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    true,
  );
  checks.push({
    id: "AC01",
    expected: "Requested preference media queries active",
    actual: "Both active",
    passed: true,
  });
  for (const route of [
    "dashboard",
    "properties",
    "repairs",
    "compliance",
    "reports",
    "settings",
  ]) {
    await page.goto(`${baseURL}/#${route}`);
    await page.locator("h1").waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.equal(await page.locator("h1").isVisible(), true);
    assert.equal(
      await page.locator("#sidebar").evaluate((node) => node.inert),
      true,
    );
  }
  checks.push({
    id: "AC02",
    expected: "Six routes usable at 375px with hidden navigation inert",
    actual: "Visible headings; no page-wide overflow; hidden links inert",
    passed: true,
  });
  await page.goto(`${baseURL}/#dashboard`);
  await page.locator("h1").waitFor();
  const animationDuration = await page
    .locator("#sidebar")
    .evaluate((node) => parseFloat(getComputedStyle(node).transitionDuration));
  assert.ok(animationDuration <= 0.02);
  checks.push({
    id: "AC03",
    expected: "Nonessential sidebar transition removed with reduced motion",
    actual: `${animationDuration} seconds`,
    passed: true,
  });
  await page.locator("#main").evaluate((node) => node.blur());
  await page.screenshot({
    path: `${evidence}/forced-colours-dashboard.png`,
    fullPage: true,
  });
  await page.locator('[data-action="add-property"]').first().click();
  await page.locator('#property-form [name="address"]').waitFor();
  await page
    .locator("#property-form")
    .getByRole("button", { name: "Save property" })
    .click();
  assert.equal(
    await page
      .locator('#property-form [name="address"]')
      .getAttribute("aria-invalid"),
    "true",
  );
  assert.equal(
    await page
      .locator('#property-form [name="address"]')
      .evaluate((node) => node === document.activeElement),
    true,
  );
  const errorId = await page
    .locator('#property-form [name="address"]')
    .getAttribute("aria-describedby");
  assert.ok(await page.locator(`#${errorId}`).textContent());
  await page.screenshot({
    path: `${evidence}/forced-colours-form-error.png`,
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#property-modal").isVisible(), false);
  checks.push({
    id: "AC04",
    expected: "Validation text, focus and Escape usable in forced colours",
    actual:
      "Described field error; first invalid control focused; dialog closes",
    passed: true,
  });
  assert.deepEqual(uncaughtErrors, []);
  checks.push({
    id: "AC05",
    expected: "No uncaught page errors",
    actual: "None observed",
    passed: true,
  });
  const result = {
    date: new Date().toISOString().slice(0, 10),
    url: baseURL,
    browser: browser.version(),
    viewport: { width: 375, height: 1000 },
    method:
      "Playwright emulation of forced-colors and reduced-motion; not an OS high-contrast or screen-reader test",
    checks,
    passed: checks.length,
    failed: 0,
  };
  await writeFile(
    `${evidence}/results.json`,
    `${JSON.stringify(result, null, 2)}\n`,
  );
  console.log(
    `${checks.length} preference/accessibility smoke checks passed. Evidence: ${evidence}`,
  );
} finally {
  await browser.close();
}
