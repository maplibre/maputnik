import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import replace from '@rollup/plugin-replace';

export default defineConfig({
  server: {
    port: 8888
  },
  plugins: [
    replace({
      preventAssignment: true,
      include: /\/jsonlint-lines-primitives\/lib\/jsonlint.js/,
      delimiters: ['', ''],
      values: {
          '_token_stack:': ''
      }
    }) as any,
    react()
  ],
  define: {
    global: "window",
  },
});