import { setRTLTextPlugin, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);
setRTLTextPlugin(`${import.meta.env.BASE_URL}mapbox-gl-rtl-text.js`, false);
