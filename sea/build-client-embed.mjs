import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../client/dist");
const outFile = path.resolve(__dirname, "dist", "client-bundle.js");

function walkDir(dir, base = dir) {
  const result = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(result, walkDir(full, base));
    } else {
      const key = "/" + path.relative(base, full).replace(/\\/g, "/");
      result[key] = fs.readFileSync(full).toString("base64");
    }
  }
  return result;
}

const files = walkDir(distDir);
const output = `module.exports = ${JSON.stringify(files)};`;
fs.writeFileSync(outFile, output);
console.log(
  `Embedded ${Object.keys(files).length} files -> sea/dist/client-bundle.js`,
);
