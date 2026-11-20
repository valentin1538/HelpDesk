import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Hors Docker : API sur localhost:5000. Dans Docker : API_TARGET=http://server:5000 (compose.yaml).
const apiTarget = process.env.API_TARGET || "http://localhost:5000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Les événements de fichiers Windows ne traversent pas les volumes Docker : on scrute.
    watch: { usePolling: process.env.VITE_USE_POLLING === "true" },
    proxy: {
      "/api": apiTarget,
      "/socket.io": { target: apiTarget, ws: true },
    },
  },
});
