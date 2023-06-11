import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [vue(), splitVendorChunkPlugin()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import '@/global.scss';",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
});
