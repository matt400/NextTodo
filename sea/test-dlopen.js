// test-dlopen.js
const fs = require("fs");
const p =
  process.env.BETTER_SQLITE3_BINDINGS || "./sea/native/better_sqlite3.node";
console.log("TEST dlopen using", p);
if (!fs.existsSync(p)) {
  console.error("file not found:", p);
  process.exit(2);
}
const mod = { exports: {} };
try {
  process.dlopen(mod, p);
  console.log("dlopen ok, exports keys:", Object.keys(mod.exports));
} catch (e) {
  console.error("dlopen failed:", e && e.stack ? e.stack : e);
  process.exit(3);
}
