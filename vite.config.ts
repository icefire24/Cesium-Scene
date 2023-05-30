import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { presetAttributify, presetUno } from "unocss";
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
    UnoCSS({
      presets: [presetAttributify(), presetUno()],
    }),
  ],
});
