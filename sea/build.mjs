import * as esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: [path.resolve(__dirname, "sea.js")],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node22",
  outfile: path.resolve(__dirname, "dist", "sea-bundle.js"),
  // NOTE: remove better-sqlite3 from external so plugin can inject shim
  external: ["fsevents"],
  plugins: [
    {
      name: "sea-native-modules",
      setup(build) {
        // shim for require('bindings')
        build.onResolve({ filter: /^bindings$/ }, () => ({
          path: "bindings-stub",
          namespace: "bindings-stub",
        }));
        build.onLoad({ filter: /.*/, namespace: "bindings-stub" }, () => ({
          contents: `
            module.exports = function bindings() {
              const bindingPath = process.env.BETTER_SQLITE3_BINDINGS;
              if (!bindingPath) throw new Error("BETTER_SQLITE3_BINDINGS not set");
              const mod = { exports: {} };
              process.dlopen(mod, bindingPath);
              return mod.exports;
            };
          `,
          loader: "js",
        }));

        // shim for require('better-sqlite3')
        build.onResolve({ filter: /^better-sqlite3$/ }, () => ({
          path: "better-sqlite3-stub",
          namespace: "better-sqlite3-stub",
        }));
        build.onLoad(
          { filter: /.*/, namespace: "better-sqlite3-stub" },
          () => ({
            contents: `
            const fs = require('fs');
            const path = require('path');
            module.exports = (function() {
              const mod = { exports: {} };
              // prefer env var set by sea.js
              let p = process.env.BETTER_SQLITE3_BINDINGS;
              // fallback locations relative to the sea folder and cwd
              if (!p) {
                const tryPaths = [
                  path.resolve(__dirname, '..', 'sea', 'better_sqlite3.node'),
                  path.resolve(__dirname, '..', 'sea', 'native', 'better_sqlite3.node'),
                  path.resolve(process.cwd(), 'sea', 'better_sqlite3.node'),
                  path.resolve(process.cwd(), 'sea', 'native', 'better_sqlite3.node')
                ];
                for (const t of tryPaths) {
                  try { if (fs.existsSync(t)) { p = t; break; } } catch(e){}
                }
              }
              if (!p) throw new Error('BETTER_SQLITE3_BINDINGS not set and native binding not found');
              process.dlopen(mod, p);
              return mod.exports;
            })();
          `,
            loader: "js",
          }),
        );

        // generic .node require stub (safety)
        build.onResolve({ filter: /\.node$/ }, (args) => ({
          path: args.path,
          namespace: "node-stub",
        }));
        build.onLoad({ filter: /.*/, namespace: "node-stub" }, () => ({
          contents: `
            module.exports = (() => {
              const mod = { exports: {} };
              const p = process.env.BETTER_SQLITE3_BINDINGS;
              if (!p) throw new Error("BETTER_SQLITE3_BINDINGS not set");
              process.dlopen(mod, p);
              return mod.exports;
            })();
          `,
          loader: "js",
        }));
      },
    },
  ],
  allowOverwrite: true,
});

console.log("✅ dist/sea-bundle.js built");
