import { defineConfig } from "cypress";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    baseUrl: "http://localhost:8888",
    scrollBehavior: "center",
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
