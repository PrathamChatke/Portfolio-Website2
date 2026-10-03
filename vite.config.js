import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Keep the CRA-style env names (REACT_APP_*) so .env files are portable.
  envPrefix: ["VITE_", "REACT_APP_"],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    pool: "threads",
  },
});
