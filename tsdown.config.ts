import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs'],
  platform: 'node',
  target: 'node24',
  outDir: './dist',
  sourcemap: false,
  clean: true,
  minify: true,
  dts: false,
  bundle: true,
  // 以下、AWS Lambda向け設定
  outputOptions: {
    inlineDynamicImports: true
  },
  noExternal: [/.*/],
  external: ['@aws-sdk/*'] // AWS環境にあるものだけ外す
});
