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
  external: ["better-sqlite3", "fsevents"],
  plugins: [
    {
      name: "sea-native-modules",
      setup(build) {
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
        }));

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
        }));
      },
    },
  ],
});

console.log("✅ dist/bundle.js built");
