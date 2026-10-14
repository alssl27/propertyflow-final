import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Git supplies committed bytes, including dotfiles, without copying ignored local files.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const git = (args, options = {}) =>
  execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

if (git(["status", "--porcelain", "--untracked-files=normal"]).trim()) {
  throw new Error(
    "Commit or resolve project changes before packaging a revision.",
  );
}
const commit = git(["rev-parse", "HEAD"]).trim();
const files = git(["ls-tree", "-r", "-z", commit])
  .split("\0")
  .filter(Boolean)
  .map((entry) => {
    const match = /^(100644|100755) blob ([a-f0-9]+)\t(.+)$/s.exec(entry);
    if (!match)
      throw new Error("Only regular committed files can be packaged.");
    const [, , blob, path] = match;
    if (
      /(^|\/)(?:\.env[^/]*|\.git|\.vercel|\.aws|\.codex|node_modules|dist|submission-artifacts|playwright-report|test-results)(?:\/|$)/.test(
        path,
      )
    ) {
      throw new Error(
        `Excluded local configuration or output is tracked: ${path}`,
      );
    }
    return { path, blob };
  });

// Batch-read blobs so manifest hashes describe archive bytes, regardless of checkout line endings.
const blobs = git(["cat-file", "--batch"], {
  input: files.map(({ blob }) => blob).join("\n") + "\n",
  encoding: null,
});
let offset = 0;
const entries = files.map(({ path, blob }) => {
  const headerEnd = blobs.indexOf(10, offset);
  const header = blobs.subarray(offset, headerEnd).toString("utf8");
  const match = /^([a-f0-9]+) blob (\d+)$/.exec(header);
  if (headerEnd < 0 || !match || match[1] !== blob)
    throw new Error(`Cannot read committed file: ${path}`);
  const size = Number(match[2]);
  const start = headerEnd + 1;
  const end = start + size;
  if (end >= blobs.length || blobs[end] !== 10)
    throw new Error(`Incomplete committed file: ${path}`);
  offset = end + 1;
  return { path, bytes: size, sha256: sha256(blobs.subarray(start, end)) };
});

const createdAt = new Date().toISOString();
const output = join(
  root,
  "submission-artifacts",
  `propertyflow-${createdAt.replace(/[:.]/g, "-")}-${commit.slice(0, 7)}`,
);
await mkdir(output, { recursive: true });
const archiveName = `propertyflow-submission-${commit.slice(0, 7)}.zip`;
const archivePath = join(output, archiveName);
git([
  "-c",
  "core.autocrlf=false",
  "-c",
  "core.eol=lf",
  "archive",
  "--format=zip",
  "--prefix=propertyflow-final/",
  `--output=${archivePath}`,
  commit,
]);
const archive = await readFile(archivePath);
const historyName = "source-history.txt";
const history = git([
  "log",
  "--reverse",
  "--date=iso-strict",
  "--format=%H | %aI | %s",
  commit,
]);
await writeFile(join(output, historyName), history);
const manifestName = "submission-manifest.json";
const manifest = {
  createdAt,
  sourceCommit: commit,
  repository: "https://github.com/alssl27/propertyflow-final",
  liveApplication: "https://propertyflow-final.vercel.app",
  status: "Prepared for learner review; assessment not submitted.",
  gitVersion: git(["--version"]).trim(),
  archive: {
    name: archiveName,
    bytes: archive.length,
    sha256: sha256(archive),
  },
  archivePrefix: "propertyflow-final/",
  fileCount: entries.length,
  files: entries,
};
const manifestText = JSON.stringify(manifest, null, 2) + "\n";
await writeFile(join(output, manifestName), manifestText);
await writeFile(
  join(output, "SHA256SUMS.txt"),
  [
    [sha256(archive), archiveName],
    [sha256(Buffer.from(manifestText)), manifestName],
    [sha256(Buffer.from(history)), historyName],
  ]
    .map(([hash, name]) => `${hash}  ${name}\n`)
    .join(""),
);
console.log(`Packaged ${entries.length} committed files from ${commit}.`);
console.log(`Archive: ${archivePath}`);
console.log(`Manifest and checksums: ${output}`);
