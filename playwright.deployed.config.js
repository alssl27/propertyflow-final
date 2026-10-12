import { defineConfig } from "@playwright/test";

if (!process.env.BASE_URL) {
  throw new Error("Set BASE_URL to the verified PropertyFlow deployment URL.");
}

process.env.PLAYWRIGHT_EVIDENCE_DIR = "docs/evidence/deployed";

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 30000,
  outputDir: "docs/evidence/deployed/artifacts",
  use: {
    baseURL: process.env.BASE_URL,
    channel: "chrome",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "docs/evidence/deployed/browser-results.json" }],
  ],
});
