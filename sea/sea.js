const path = require("path");
const fs = require("fs");
const os = require("os");
const Module = require("module");

// helper
function ensureAbsolute(p) {
  if (!p) return p;
  return path.isAbsolute(p) ? p : path.resolve(__dirname, p);
}

// Extract .node if running inside SEA
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

// Fallback: local native build next to package
if (!bindingPath) {
  const candidate = path.resolve(__dirname, "native", "better_sqlite3.node");
  if (fs.existsSync(candidate)) {
    bindingPath = candidate;
  }
}

// Final check and env
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

// Patch Module._load to intercept bindings, better-sqlite3 and .node requires
const _originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  // intercept require('bindings')
  if (request === "bindings") {
    return function bindings() {
      const mod = { exports: {} };
      const p = process.env.BETTER_SQLITE3_BINDINGS;
      if (!p) throw new Error("BETTER_SQLITE3_BINDINGS not set");
      process.dlopen(mod, p);
      return mod.exports;
    };
  }

  // intercept require('better-sqlite3')
  if (request === "better-sqlite3") {
    try {
      const mod = { exports: {} };
      const p = process.env.BETTER_SQLITE3_BINDINGS;
      if (p && fs.existsSync(p)) {
        process.dlopen(mod, p);
        return mod.exports;
      }
      // fallback search paths
      const tryPaths = [
        process.env.BETTER_SQLITE3_BINDINGS,
        path.resolve(__dirname, "native", "better_sqlite3.node"),
        path.resolve(__dirname, "better_sqlite3.node"),
      ].filter(Boolean);
      let found = null;
      for (const t of tryPaths) {
        try {
          if (fs.existsSync(t)) {
            found = t;
            break;
          }
        } catch (e) {}
      }
      if (!found)
        throw new Error(
          "BETTER_SQLITE3_BINDINGS not set and native binding not found",
        );
      process.dlopen(mod, found);
      return mod.exports;
    } catch (err) {
      console.warn(
        "[sea] interception for better-sqlite3 failed:",
        err && err.message,
      );
      // fall through to original loader to produce the original error if needed
    }
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

// Register synthetic cached module for 'better-sqlite3' so require('better-sqlite3') returns the native addon
try {
  const binding = process.env.BETTER_SQLITE3_BINDINGS;
  if (binding && fs.existsSync(binding)) {
    const nativeMod = { exports: {} };
    try {
      process.dlopen(nativeMod, binding);
    } catch (e) {
      console.warn(
        "[sea] process.dlopen failed for synthetic cache:",
        e && e.message,
      );
      throw e;
    }

    try {
      // create a Module instance and populate caches under several keys to maximize compatibility
      const synthetic = new Module("better-sqlite3", module);
      synthetic.filename = "better-sqlite3";
      synthetic.id = "better-sqlite3";
      synthetic.exports = nativeMod.exports;

      Module._cache = Module._cache || {};
      Module._cache["better-sqlite3"] = synthetic;

      // try to resolve a filename key and also populate require.cache if possible
      try {
        const resolvedName = Module._resolveFilename("better-sqlite3", module);
        Module._cache[resolvedName] = synthetic;
        require.cache = require.cache || {};
        require.cache[resolvedName] = synthetic;
      } catch (e) {
        // ignore resolve errors, keep the simple key
      }

      // also populate require.cache under the plain id if present
      try {
        require.cache = require.cache || {};
        require.cache["better-sqlite3"] = synthetic;
      } catch (e) {}

      console.log(
        "[sea] registered synthetic module cache for better-sqlite3 ->",
        binding,
      );
    } catch (e) {
      console.warn(
        "[sea] failed to register synthetic module cache:",
        e && e.message,
      );
    }
  } else {
    console.warn(
      "[sea] BETTER_SQLITE3_BINDINGS not set or file missing; synthetic cache not registered",
    );
  }
} catch (e) {
  console.warn(
    "[sea] error while preparing synthetic better-sqlite3 cache:",
    e && e.message,
  );
}

// Load the bundled app
try {
  require("./dist/bundle.js");
} catch (err) {
  console.error(
    "[sea] failed to require bundle:",
    err && err.stack ? err.stack : err,
  );
  throw err;
}
