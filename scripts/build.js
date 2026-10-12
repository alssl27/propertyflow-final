import { cp, mkdir } from "node:fs/promises";
await mkdir("dist/docs", { recursive: true });
for (const item of ["index.html", "404.html", "assets", "data"])
  await cp(item, `dist/${item}`, { recursive: true });
await cp("docs/README-GUIDE.md", "dist/docs/README-GUIDE.md");
console.log("Static release assembled in dist/; no runtime dependencies.");
