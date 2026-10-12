import { readFile, readdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
const files = [
  "index.html",
  "404.html",
  "README.md",
  ...(await readdir("docs"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => `docs/${name}`),
];
let count = 0;
for (const file of files) {
  const text = await readFile(file, "utf8");
  const links = [
    ...text.matchAll(/(?:href|src)="([^"#]+)"|\[[^\]]*\]\(([^)]+)\)/g),
  ].map((match) => match[1] || match[2]);
  for (const link of links) {
    if (/^(https?:|mailto:|#)/.test(link)) continue;
    const path = link.split("#")[0];
    if (!path) continue;
    await access(
      resolve(
        path.startsWith("/") ? "." : dirname(file),
        path.replace(/^\//, ""),
      ),
    ).catch(() => {
      throw new Error(`${file}: missing ${link}`);
    });
    count++;
  }
}
console.log(
  `${count} local document and asset links resolve. External URLs are not fetched by this check.`,
);
