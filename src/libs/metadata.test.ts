import { describe, it, expect, vi, afterEach } from "vitest";
import { downloadGlyphsMetadata, downloadSpriteMetadata } from "./metadata";

afterEach(() => vi.restoreAllMocks());

describe("downloadGlyphsMetadata", () => {
  it("returns an empty list for an empty url", async () => {
    expect(await downloadGlyphsMetadata("")).toEqual([]);
  });

  it("fetches the fontstacks list and de-duplicates it", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ["A", "A", "B"] })));
    const fonts = await downloadGlyphsMetadata("https://example.com/{fontstack}/{range}.pbf");
    expect(fonts.sort()).toEqual(["A", "B"]);
  });

  it("returns the default on a failed request", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false })));
    expect(await downloadGlyphsMetadata("https://example.com/x/{fontstack}/{range}.pbf")).toEqual([]);
  });
});

describe("downloadSpriteMetadata", () => {
  it("returns the sprite icon names", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ airport: {}, park: {} }) })));
    const icons = await downloadSpriteMetadata("https://example.com/sprite");
    expect(icons.sort()).toEqual(["airport", "park"]);
  });

  it("returns an empty list for an empty base url", async () => {
    expect(await downloadSpriteMetadata("")).toEqual([]);
  });
});
