import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
// When the app is already served elsewhere (e.g. the docker e2e job) set
// E2E_NO_WEBSERVER=1 so Playwright does not start its own dev server.
const useExternalServer = !!process.env.E2E_NO_WEBSERVER;
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:8888/";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          // Allow WebGL (maplibre) to fall back to software rendering in headless.
          args: [
            "--disable-gpu",
            "--enable-features=AllowSwiftShaderFallback,AllowSoftwareGLFallbackDueToCrashes",
            "--enable-unsafe-swiftshader",
          ],
        },
      },
    },
  ],
  webServer: useExternalServer
    ? undefined
    : {
      command: "npm run start",
      url: "http://localhost:8888/maputnik/",
      reuseExistingServer: !isCI,
      timeout: 120000,
    },
});
