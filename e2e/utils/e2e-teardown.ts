import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

/**
 * Merges the per-test istanbul coverage chunks collected in `.nyc_output` into a
 * report (configured by `.nycrc.json`) once the whole e2e run has finished.
 */
export default function globalTeardown(): void {
  const dir = path.resolve(process.cwd(), ".nyc_output");
  const hasCoverage = fs.existsSync(dir) && fs.readdirSync(dir).some((f) => f.endsWith(".json"));
  if (!hasCoverage) {
    console.warn("No coverage data collected; skipping coverage report.");
    return;
  }
  try {
    execFileSync("npx", ["nyc", "report"], { stdio: "inherit" });
  } catch (error) {
    // Don't fail the whole run if the report can't be generated (e.g. when
    // running against a container whose source paths differ from the host).
    console.warn("Failed to generate coverage report:", error);
  }
}
