import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
if (dirname(output) !== root)
  throw new Error("Refusing to clean an unexpected build directory.");

await rm(output, { recursive: true, force: true });
await mkdir(join(output, "docs"), { recursive: true });
for (const item of ["index.html", "404.html", "assets", "data"])
  await cp(join(root, item), join(output, item), { recursive: true });
await cp(
  join(root, "docs", "readme-guide.md"),
  join(output, "docs", "readme-guide.md"),
);
console.log("Static release assembled in dist/; no runtime dependencies.");
