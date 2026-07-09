import { test, expect, type Page } from "@playwright/test";
import { readCoverage, writeCoverage } from "./coverage";

let activePage: Page | undefined;
const coverageChunks: unknown[] = [];

/** The page for the currently running test. Throws if used outside a test. */
export function currentPage(): Page {
  if (!activePage) {
    throw new Error("No active page: a MaputnikDriver method was called outside of a running test.");
  }
  return activePage;
}

/** Records a coverage snapshot (called before navigations, which reset __coverage__). */
export function recordCoverageChunk(chunk: unknown): void {
  if (chunk) coverageChunks.push(chunk);
}

/**
 * Auto fixture that binds the current test's page for the (page-lazy)
 * MaputnikDriver, auto-accepts confirm dialogs, and writes the istanbul
 * coverage collected during the test to `.nyc_output`.
 */
const extendedTest = test.extend<{ maputnikPage: void }>({
  maputnikPage: [
    async ({ page }, use, testInfo) => {
      activePage = page;
      coverageChunks.length = 0;
      // Accept confirm dialogs (e.g. the "replace current style" prompt). These
      // are dismissed by default, which would cancel loading a style via URL.
      page.on("dialog", (dialog) => dialog.accept().catch(() => undefined));

      await use();

      const finalCoverage = await readCoverage(page);
      if (finalCoverage) coverageChunks.push(finalCoverage);
      coverageChunks.forEach((chunk, index) => writeCoverage(chunk, `${testInfo.testId}-${index}`));
      coverageChunks.length = 0;
      activePage = undefined;
    },
    { auto: true },
  ],
});

const describe = extendedTest.describe;
const beforeEach = extendedTest.beforeEach;
export {
  expect,
  describe,
  extendedTest as test,
  beforeEach,
};
