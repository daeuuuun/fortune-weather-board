import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/aztro": {
        target: "https://aztro.sameerkumar.website",
        changeOrigin: true,
        // /aztro?sign=... -> /?sign=...
        rewrite: (path) => path.replace(/^\/aztro/, ""),
      },
    },
  },
});