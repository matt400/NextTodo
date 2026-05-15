const path = require("path");
const fs = require("fs");
const os = require("os");

process.env.NODE_ENV = "production";

// Extract .node from SEA assets
let bindingPath;
try {
  const sea = require("node:sea");
  if (sea && sea.isSea && sea.isSea()) {
    const asset = sea.getAsset("better-sqlite3.node");
    if (asset) {
      const tmpPath = path.join(
        os.tmpdir(),
        `better_sqlite3-${process.pid}.node`,
      );
      fs.writeFileSync(tmpPath, Buffer.from(asset), { mode: 0o755 });
      bindingPath = tmpPath;
      console.log("[sea] extracted better_sqlite3.node ->", tmpPath);
    }
  }
} catch (e) {}

if (!bindingPath) {
  bindingPath = path.resolve(__dirname, "sea", "native", "better_sqlite3.node");
}

if (!fs.existsSync(bindingPath)) {
  console.error("[sea] ERROR: binding not found:", bindingPath);
  process.exit(1);
}

process.env.BETTER_SQLITE3_BINDINGS = bindingPath;

try {
  const exeDir = fs.existsSync(process.execPath)
    ? path.dirname(process.execPath)
    : process.cwd();

  const dbDir = path.join(exeDir, "data");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log("[sea] created database directory:", dbDir);
  }

  const dbPath = path.join(dbDir, "nexttodo.db");
  process.env.DATABASE_URL = `file:${dbPath}`;
  console.log("[sea] DATABASE_URL set to:", process.env.DATABASE_URL);
} catch (e) {
  console.warn("[sea] failed to set DATABASE_URL:", e && e.message);
}

// Load the bundled app
require("./dist/server-bundle.js");
