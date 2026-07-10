import { describe, it, expect } from "vitest";
import { addSource, changeSource, deleteSource } from "./source";

const style = { version: 8, id: "s", sources: { a: { type: "vector" } }, layers: [] } as any;

describe("source helpers", () => {
  it("adds a source", () => {
    const result = addSource(style, "b", { type: "geojson", data: {} } as any);
    expect(result.sources.b).toEqual({ type: "geojson", data: {} });
    expect(result.sources.a).toBeDefined();
  });

  it("changes an existing source", () => {
    const result = changeSource(style, "a", { type: "raster" } as any);
    expect(result.sources.a).toEqual({ type: "raster" });
  });

  it("deletes a source without mutating the input", () => {
    const result = deleteSource(style, "a");
    expect(result.sources.a).toBeUndefined();
    expect(style.sources.a).toBeDefined();
  });
});
