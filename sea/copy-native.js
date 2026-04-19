const fs = require("fs");
const path = require("path");

const srcCandidates = [
  path.resolve(
    __dirname,
    "..",
    "node_modules",
    "better-sqlite3",
    "build",
    "Release",
    "better_sqlite3.node",
  ),
  path.resolve(
    __dirname,
    "..",
    "node_modules",
    "better-sqlite3",
    "build",
    "Debug",
    "better_sqlite3.node",
  ),
];

let src = srcCandidates.find((p) => fs.existsSync(p));
if (!src) {
  console.error(
    "better_sqlite3.node not found in node_modules. Rebuild better-sqlite3 first.",
  );
  process.exit(1);
}

const dstRoot = path.resolve(__dirname);
const dst1 = path.join(dstRoot, "better_sqlite3.node");
const dst2 = path.join(dstRoot, "native", "better_sqlite3.node");

fs.mkdirSync(path.dirname(dst2), { recursive: true });
fs.copyFileSync(src, dst1);
fs.copyFileSync(src, dst2);
fs.chmodSync(dst1, 0o755);
fs.chmodSync(dst2, 0o755);

console.log("copied", src, "->", dst1);
console.log("copied", src, "->", dst2);
