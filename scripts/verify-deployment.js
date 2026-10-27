import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const deploymentURL = process.env.DEPLOYMENT_URL;
const deploymentId = process.env.DEPLOYMENT_ID;
if (!deploymentURL)
  throw new Error(
    "Set DEPLOYMENT_URL to the inspected immutable deployment URL.",
  );
if (!deploymentId)
  throw new Error(
    "Set DEPLOYMENT_ID to the inspected production deployment ID.",
  );

const status = execFileSync(
  "git",
  ["status", "--porcelain", "--untracked-files=normal"],
  { encoding: "utf8" },
).trim();
if (status)
  throw new Error(
    "Commit or resolve project changes before attributing deployment bytes to a revision.",
  );

const deployment = new URL(deploymentURL);
const origin = deployment.origin;
if (deployment.protocol !== "https:" || !origin.endsWith(".vercel.app"))
  throw new Error("DEPLOYMENT_URL must be an inspected Vercel deployment URL.");

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const checks = [
  ["/", 200, "dist/index.html"],
  ["/index.html", 200, "dist/index.html"],
  ["/assets/css/styles.css", 200, "dist/assets/css/styles.css"],
  ["/assets/js/app.js", 200, "dist/assets/js/app.js"],
  ["/assets/js/api.js", 200, "dist/assets/js/api.js"],
  ["/assets/js/domain.js", 200, "dist/assets/js/domain.js"],
  ["/assets/img/favicon.svg", 200, "dist/assets/img/favicon.svg"],
  ["/data/properties.json", 200, "dist/data/properties.json"],
  ["/data/repairs.json", 200, "dist/data/repairs.json"],
  ["/data/compliance.json", 200, "dist/data/compliance.json"],
  ["/docs/readme-guide.md", 200, "dist/docs/readme-guide.md"],
  ["/missing/nested/path", 404, "dist/404.html"],
  ["/data/missing.json", 404, "dist/404.html"],
];

const results = [];
for (const [path, expectedStatus, localFile] of checks) {
  const localBytes = await readFile(localFile);
  const response = await fetch(new URL(path, origin), {
    cache: "no-store",
    headers: { "user-agent": "PropertyFlow deployment verifier" },
    redirect: "manual",
  });
  const remoteBytes = Buffer.from(await response.arrayBuffer());
  const localSha256 = sha256(localBytes);
  const remoteSha256 = sha256(remoteBytes);
  const finalOriginMatches = new URL(response.url).origin === origin;
  const expectedNosniff = path.startsWith("/assets/");
  const hasExpectedNosniff =
    !expectedNosniff ||
    response.headers.get("x-content-type-options") === "nosniff";
  const passed =
    response.status === expectedStatus &&
    localSha256 === remoteSha256 &&
    finalOriginMatches &&
    hasExpectedNosniff;
  results.push({
    path,
    status: response.status,
    expectedStatus,
    finalURL: response.url,
    contentType: response.headers.get("content-type"),
    xContentTypeOptions: response.headers.get("x-content-type-options"),
    finalOriginMatches,
    bytes: remoteBytes.length,
    sha256: remoteSha256,
    localFile,
    localSha256,
    matchesLocalBytes: remoteSha256 === localSha256,
    custom404: expectedStatus === 404,
    passed,
  });
  console.log(
    `${passed ? "PASS" : "FAIL"} ${path}: HTTP ${response.status}; bytes match=${remoteSha256 === localSha256}`,
  );
}

const passed = results.filter((result) => result.passed).length;
const report = {
  deploymentURL: origin,
  deploymentId,
  checkedAt: new Date().toISOString(),
  localRevision: revision,
  kind: "Read-only HTTP smoke and exact-byte comparison against local dist",
  summary: { checks: results.length, passed, failed: results.length - passed },
  results,
};
await writeFile(
  "docs/evidence/deployed/http-results.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

if (passed !== results.length) {
  process.exitCode = 1;
} else {
  console.log(`${passed}/${results.length} deployed HTTP/hash checks passed.`);
}
