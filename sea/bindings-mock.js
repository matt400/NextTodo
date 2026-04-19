module.exports = function bindings() {
  const mod = { exports: {} };
  const bindingPath = process.env.BETTER_SQLITE3_BINDINGS;
  if (!bindingPath) throw new Error("BETTER_SQLITE3_BINDINGS is not set");
  process.dlopen(mod, bindingPath);
  return mod.exports;
};
