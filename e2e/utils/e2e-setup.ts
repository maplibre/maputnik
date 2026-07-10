import fs from "node:fs";
import path from "node:path";

/**
 * Clears the istanbul coverage output directory before the e2e run so stale
 * coverage from previous runs is not merged into the report.
 */
export default function globalSetup(): void {
  const dir = path.resolve(process.cwd(), ".nyc_output");
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}
