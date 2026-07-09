import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

let activePage: Page | undefined;
const coverageChunks: unknown[] = [];

/** The page for the currently running test. Throws if used outside a test. */
export function currentPage(): Page {
  if (!activePage) {
    throw new Error("No active page: a MaputnikDriver method was called outside of a running test.");
  }
  return activePage;
}

const OUTPUT_DIR = path.resolve(process.cwd(), ".nyc_output");

/**
 * Reads the istanbul coverage object (injected by vite-plugin-istanbul) from the
 * given page. Returns `null` when the page has not been instrumented.
 */
async function readCoverage(page: Page): Promise<unknown | null> {
  try {
    return await page.evaluate(() => (window as unknown as { __coverage__?: unknown }).__coverage__ ?? null);
  } catch {
    // Page might be navigating/closed.
    return null;
  }
}

/**
 * Persists a coverage chunk to `.nyc_output` so that `nyc report` can merge it.
 * istanbul-lib-coverage (used by nyc) sums the hit counts across every file it
 * finds, so writing one file per chunk is enough to accumulate coverage across
 * navigations and tests.
 */
export function writeCoverage(coverage: unknown, id: string): void {
  if (!coverage) return;
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, `playwright-${id}.json`), JSON.stringify(coverage));
}

/** Records a coverage snapshot (called before navigations, which reset __coverage__). */
export async function recordCoverageChunk(page: Page): Promise<void> {
  const chunk = await readCoverage(page);
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
