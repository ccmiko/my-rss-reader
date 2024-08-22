import * as esbuild from "esbuild";

(async () => {
  await esbuild.build({
    entryPoints: ["src/index.ts"],
    minify: true,
    bundle: true,
    platform: "node",
    target: ["node22"],
    outfile: "dist/index.js",
  });
})();
