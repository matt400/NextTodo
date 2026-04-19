// sea.js
const path = require("path");
const fs = require("fs");
const os = require("os");
const Module = require("module");

// helper
function ensureAbsolute(p) {
  if (!p) return p;
  return path.isAbsolute(p) ? p : path.resolve(__dirname, p);
}

// 1. Extract .node if running inside SEA
let bindingPath;
try {
  const sea = require("node:sea");
  if (sea && sea.isSea && sea.isSea()) {
    const assetName = "better_sqlite3.node";
    const asset = sea.getAsset(assetName);
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

// 2. Fallback: local native build next to package
if (!bindingPath) {
  const candidate = path.resolve(__dirname, "native", "better_sqlite3.node");
  if (fs.existsSync(candidate)) {
    bindingPath = candidate;
  }
}

// 3. Final check and env
if (!bindingPath) {
  console.error(
    "[sea] ERROR: better_sqlite3.node not found. Set BETTER_SQLITE3_BINDINGS env var or place native/better_sqlite3.node next to sea.js",
  );
} else {
  bindingPath = ensureAbsolute(bindingPath);
  if (!fs.existsSync(bindingPath)) {
    console.error("[sea] ERROR: bindingPath does not exist:", bindingPath);
  } else {
    console.log("[sea] using bindingPath:", bindingPath);
    process.env.BETTER_SQLITE3_BINDINGS = bindingPath;
  }
}

// 4. Patch Module._load to intercept bindings and .node requires
const _originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "bindings") {
    return function bindings() {
      const mod = { exports: {} };
      const p = process.env.BETTER_SQLITE3_BINDINGS;
      if (!p) throw new Error("BETTER_SQLITE3_BINDINGS not set");
      process.dlopen(mod, p);
      return mod.exports;
    };
  }

  try {
    const req = String(request);
    const lower = req.toLowerCase();
    if (lower.endsWith(".node") || lower.includes("better_sqlite3.node")) {
      const mod = { exports: {} };
      let resolved = request;
      try {
        resolved = Module._resolveFilename(request, parent);
      } catch (e) {
        resolved = process.env.BETTER_SQLITE3_BINDINGS;
      }
      if (!resolved)
        throw new Error("Could not resolve native module path for " + request);
      if (!path.isAbsolute(resolved)) {
        resolved = path.resolve(process.cwd(), resolved);
      }
      if (!fs.existsSync(resolved)) {
        resolved = process.env.BETTER_SQLITE3_BINDINGS;
      }
      if (!resolved || !fs.existsSync(resolved)) {
        throw new Error(
          "Native binding not found at resolved path: " + String(resolved),
        );
      }
      process.dlopen(mod, resolved);
      return mod.exports;
    }
  } catch (err) {
    console.warn("[sea] Module._load interception error:", err && err.message);
  }

  return _originalLoad.call(this, request, parent, isMain);
};

// 5. Load the bundled app
try {
  require("./dist/bundle.js");
} catch (err) {
  console.error(
    "[sea] failed to require bundle:",
    err && err.stack ? err.stack : err,
  );
  throw err;
}
