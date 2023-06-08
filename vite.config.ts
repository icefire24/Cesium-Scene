import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { presetAttributify, presetUno } from "unocss";
import autoImport from 'unplugin-auto-import/vite'
import cesium from 'vite-plugin-cesium'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": "/src",
    }
  },
  plugins: [
    react(),
    cesium(),
    autoImport({
      imports: ['react'],
      dts: 'src/auto-imports.d.ts',
    }),
    UnoCSS({
      presets: [presetAttributify(), presetUno()],
    }),
  ],
});
