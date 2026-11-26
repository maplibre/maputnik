import { describe, it, expect, vi, afterEach } from "vitest";
import { decodeSdf, spriteURL } from "./sprites";
import { downloadSpriteMetadata } from "./metadata";

afterEach(() => vi.unstubAllGlobals());

describe("sprite metadata", () => {
  it("keeps tokens after the extension and resolves root-relative URLs", () => {
    vi.stubGlobal("document", { baseURI: "https://editor.test/maputnik/" });
    expect(spriteURL("https://sprites.test/icons?key=secret#section", "@2x.json")).toBe("https://sprites.test/icons@2x.json?key=secret#section");
    expect(spriteURL("/icons?key=secret", "@2x.png")).toBe("https://editor.test/icons@2x.png?key=secret");
  });

  it("keeps atlas bounds and SDF/pixel ratio metadata with MapLibre namespace IDs", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({
      circle: { x: 5, y: 7, width: 32, height: 24, pixelRatio: 2, sdf: true },
    }) }));
    const sprites = await downloadSpriteMetadata([
      { id: "default", url: "https://sprites.test/a" },
      { id: "extra", url: "https://sprites.test/b" },
    ]);
    expect(sprites).toEqual([
      { id: "circle", imageUrl: "https://sprites.test/a@2x.png", x: 5, y: 7, width: 32, height: 24, pixelRatio: 2, sdf: true },
      { id: "extra:circle", imageUrl: "https://sprites.test/b@2x.png", x: 5, y: 7, width: 32, height: 24, pixelRatio: 2, sdf: true },
    ]);
  });

  it("ignores invalid rectangles without losing valid names", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({
      valid: { x: 0, y: 0, width: 16, height: 16, pixelRatio: 1 },
      zero: { x: 0, y: 0, width: 0, height: 16, pixelRatio: 1 },
      invalid: null,
    }) }));
    expect((await downloadSpriteMetadata("https://sprites.test/a")).map(sprite => sprite.id)).toEqual(["valid"]);
  });

  it("has no catalog when the style has no sprite", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await downloadSpriteMetadata(undefined)).toEqual([]);
    expect(await downloadSpriteMetadata("")).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("SDF previews", () => {
  it("turns distances into a black silhouette rather than displaying the distance bitmap", () => {
    const data = new Uint8ClampedArray([255, 50, 20, 0, 255, 50, 20, 128, 255, 50, 20, 191, 255, 50, 20, 255]);
    decodeSdf(data);
    expect(Array.from(data)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 126, 0, 0, 0, 255]);
  });
});
