import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only the unit tests that live next to the source are run by Vitest. The
    // e2e specs (*.spec.ts) are run by their own runner, and the component
    // browser test is run separately.
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "e2e/**", "**/*.browser.test.tsx"],
  },
});
