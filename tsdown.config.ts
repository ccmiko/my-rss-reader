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
  // CI環境では警告がエラー扱いになるため、ローカルと同じ挙動にそろえる
  // TODO: 非推奨オプション（bundle / inlineDynamicImports）の置き換え後に外す
  failOnWarn: false,
  // 以下、AWS Lambda向け設定
  outputOptions: {
    inlineDynamicImports: true
  },
  noExternal: [/.*/],
  external: ['@aws-sdk/*'] // AWS環境にあるものだけ外す
});
