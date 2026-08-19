import path from "node:path";
import { createRequire } from "node:module";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import istanbul from "vite-plugin-istanbul";

// maplibre fetches the RTL text plugin from this URL inside its worker and evals
// it. Serving @mapbox/mapbox-gl-rtl-text's dist directory (which holds just the
// prebuilt UMD bundle) keeps the plugin's version in package.json rather than
// pinned in a CDN link. Its ESM entry is not usable here: it imports a bare .wasm
// file that Vite would emit as a URL instead of an init function.
const require = createRequire(import.meta.url);
const publicDir = path.join(
  path.dirname(require.resolve("@mapbox/mapbox-gl-rtl-text")),
  "../dist"
);

export default defineConfig(({ mode }) => ({
  server: {
    port: 8888,
  },
  build: {
    sourcemap: true,
    rolldownOptions: {
      checks: { invalidAnnotation: false },
    },
  },
  plugins: [
    react(),
    istanbul({
      requireEnv: false,
      nycrcPath: "./.nycrc.json",
      forceBuildInstrument: true, // Instrument the source so e2e runs can collect coverage
    }),
  ],
  optimizeDeps: {
    exclude: ["maplibre-gl/dist/maplibre-gl-worker.mjs"],
  },
  publicDir,
  base: mode === "desktop" ? "/" : "/maputnik/",
  define: {
    global: "globalThis"
  },
}));
