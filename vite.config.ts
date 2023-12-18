import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 8888
  },
  plugins: [react()],
  define: {
    global: "window",
  },
});
