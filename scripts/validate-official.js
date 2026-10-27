import { readFile } from "node:fs/promises";

const nuEndpoint = "https://validator.w3.org/nu/?out=json";
const cssEndpoint = "https://jigsaw.w3.org/css-validator/validator";

async function responseJson(response, service) {
  if (!response.ok)
    throw new Error(`${service} returned HTTP ${response.status}.`);
  return response.json();
}

async function validateHtml(path) {
  const source = await readFile(path);
  const report = await responseJson(
    await fetch(nuEndpoint, {
      method: "POST",
      headers: {
        "content-type": "text/html; charset=utf-8",
        "user-agent": "PropertyFlow validation script",
      },
      body: source,
    }),
    "W3C Nu HTML validator",
  );
  const errors = report.messages.filter((message) => message.type === "error");
  const notices = report.messages.length - errors.length;
  console.log(
    `${path}: W3C Nu ${errors.length} error(s), ${notices} warning/info notice(s).`,
  );
  for (const error of errors)
    console.error(`  line ${error.lastLine ?? "?"}: ${error.message}`);
  return errors.length === 0;
}

async function validateCss(path) {
  const source = await readFile(path);
  const body = new FormData();
  body.set("file", new Blob([source], { type: "text/css" }), path);
  body.set("output", "json");
  const report = await responseJson(
    await fetch(cssEndpoint, {
      method: "POST",
      headers: { "user-agent": "PropertyFlow validation script" },
      body,
    }),
    "W3C Jigsaw CSS validator",
  );
  const validation = report.cssvalidation;
  const errors = validation?.result?.errorcount ?? 0;
  const warnings = validation?.result?.warningcount ?? 0;
  console.log(
    `${path}: W3C Jigsaw validity=${Boolean(validation?.validity)}, ${errors} error(s), ${warnings} warning(s).`,
  );
  for (const error of validation?.errors ?? [])
    console.error(`  line ${error.line ?? "?"}: ${error.message}`);
  return validation?.validity === true && errors === 0;
}

console.log(`Official validation run: ${new Date().toISOString()}`);
console.log(`HTML endpoint: ${nuEndpoint}`);
console.log(`CSS endpoint: ${cssEndpoint}`);

const results = await Promise.all([
  validateHtml("index.html"),
  validateHtml("404.html"),
  validateCss("assets/css/styles.css"),
]);

if (results.every(Boolean)) {
  console.log("Official validators reported zero errors.");
} else {
  process.exitCode = 1;
}
