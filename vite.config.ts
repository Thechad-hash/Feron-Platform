import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: {
      "@shared": "/shared/src"
    }
  },
  server: {
    port: 3000
  },
  plugins: [react()]
});
