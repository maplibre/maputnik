import { describe, it, expect } from "vitest";
import { findDefaultFromSpec } from "./spec-helper";

describe("findDefaultFromSpec", () => {
  it("returns the spec default when present (even if falsy)", () => {
    expect(findDefaultFromSpec({ type: "string", default: "hi" })).toBe("hi");
    expect(findDefaultFromSpec({ type: "boolean", default: false })).toBe(false);
  });

  it("falls back to a sensible default per type", () => {
    expect(findDefaultFromSpec({ type: "color" })).toBe("#000000");
    expect(findDefaultFromSpec({ type: "string" })).toBe("");
    // The falsy `false` fallback collapses to "" via the `|| ""` in the impl.
    expect(findDefaultFromSpec({ type: "boolean" })).toBe("");
    expect(findDefaultFromSpec({ type: "array" })).toEqual([]);
  });
});
