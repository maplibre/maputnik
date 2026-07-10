import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import istanbul from "vite-plugin-istanbul";

export default defineConfig(({ mode }) => ({
  server: {
    port: 8888,
  },
  build: {
    sourcemap: true
  },
  plugins: [
    react(),
    istanbul({
      requireEnv: false,
      nycrcPath: "./.nycrc.json",
      forceBuildInstrument: true, // Instrument the source so e2e runs can collect coverage
    }),
  ],
  base: mode === "desktop" ? "/" : "/maputnik/",
  define: {
    global: "window"
  },
}));
