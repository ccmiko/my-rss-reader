import * as esbuild from "esbuild";

(async () => {
  await esbuild.build({
    entryPoints: ["src/index.ts"],
    minify: true,
    bundle: true,
    platform: "node",
    target: ["node24"],
    outfile: "dist/index.js",
  });
})();
