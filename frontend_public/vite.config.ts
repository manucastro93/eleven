import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
    AutoImport({
      resolvers: [IconsResolver({ prefix: 'Icon' })],
      dts: false,
    }),
    Icons({
      compiler: 'solid',
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5001,
  },
  build: {
    target: 'esnext',
  },
});
