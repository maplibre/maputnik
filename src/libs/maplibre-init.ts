import { setRTLTextPlugin, setWorkerUrl } from "maplibre-gl";
// maplibre-gl v6 is ESM only and cannot locate its worker through a bundler's
// module graph, so every consumer has to point it at the worker once.
// `?worker&url` (rather than plain `?url`) routes the file through Vite's worker
// pipeline, which emits a self-contained chunk including its `maplibre-gl-shared`
// sibling. See https://maplibre.org/maplibre-gl-js/docs/#vite
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

// Order matters: registering the RTL plugin spins up the worker pool, so the
// worker URL has to be in place before it.
setWorkerUrl(workerUrl);

// Served out of @mapbox/mapbox-gl-rtl-text via `publicDir` in vite.config.ts, so
// the version comes from package.json rather than a pinned CDN URL.
setRTLTextPlugin(`${import.meta.env.BASE_URL}mapbox-gl-rtl-text.js`, false);
