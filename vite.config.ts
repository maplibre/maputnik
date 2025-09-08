import replace from "@rollup/plugin-replace";
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
    replace({
      preventAssignment: true,
      include: /\/jsonlint-lines-primitives\/lib\/jsonlint.js/,
      delimiters: ["", ""],
      values: {
        "_token_stack:": "",
      },
    }),
    react(),
    istanbul({
      cypress: true,
      requireEnv: false,
      nycrcPath: "./.nycrc.json",
      forceBuildInstrument: true, //Instrument the source code for cypress runs
    }),
  ],
  base: mode === "desktop" ? "/" : "/maputnik/",
  define: {
    global: "window"
  },
}));
