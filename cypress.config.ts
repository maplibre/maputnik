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
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family !== 'chromium') {
          return;
        }
        launchOptions.args.push('--disable-gpu');
        launchOptions.args.push('--enable-features=AllowSwiftShaderFallback,AllowSoftwareGLFallbackDueToCrashes');
        launchOptions.args.push('--enable-unsafe-swiftshader');
        return launchOptions;
      });
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
