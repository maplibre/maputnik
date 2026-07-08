import { test as base, expect } from "@playwright/test";
import { MaputnikDriver } from "./maputnik-driver";

/**
 * Playwright test with a per-test `driver` (the maputnik page object) that also
 * collects istanbul coverage once the test finishes.
 */
export const test = base.extend<{ driver: MaputnikDriver }>({
  driver: async ({ page }, use, testInfo) => {
    const driver = new MaputnikDriver(page);
    await use(driver);
    await driver.flushCoverage(testInfo);
  },
});

export { expect };

/**
 * Registers the shared `beforeEach` used by most specs: mock the style responses
 * and load the default (geojson + raster) style.
 */
export function setupMaputnik(): void {
  test.beforeEach(async ({ driver }) => {
    await driver.given.setupMockBackedResponses();
    await driver.when.setStyle("both");
  });
}
