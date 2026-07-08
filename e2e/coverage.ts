import fs from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

const OUTPUT_DIR = path.resolve(process.cwd(), ".nyc_output");

/**
 * Reads the istanbul coverage object (injected by vite-plugin-istanbul) from the
 * given page. Returns `null` when the page has not been instrumented.
 */
export async function readCoverage(page: Page): Promise<unknown | null> {
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
