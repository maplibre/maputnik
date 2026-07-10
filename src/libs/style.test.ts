import { describe, it, expect } from "vitest";
import type { StyleSpecification } from "maplibre-gl";
import style from "./style";

function baseStyle(overrides: Partial<StyleSpecification> = {}): StyleSpecification {
  return { version: 8, sources: {}, layers: [], ...overrides } as StyleSpecification;
}

describe("ensureStyleValidity", () => {
  it("adds an id and strips interactive from layers", () => {
    const result = style.ensureStyleValidity(
      baseStyle({
        layers: [{ id: "l", type: "background", interactive: true } as any],
      })
    );
    expect(result.id).toBeTruthy();
    expect("interactive" in result.layers[0]).toBe(false);
  });

  it("keeps an existing id", () => {
    const result = style.ensureStyleValidity(baseStyle({ id: "keep-me" } as any));
    expect(result.id).toBe("keep-me");
  });
});

describe("generateId", () => {
  it("generates a non-empty string", () => {
    expect(typeof style.generateId()).toBe("string");
    expect(style.generateId().length).toBeGreaterThan(0);
  });
});

describe("indexOfLayer", () => {
  const layers = [{ id: "a" }, { id: "b" }] as any;
  it("returns the index of a matching layer", () => {
    expect(style.indexOfLayer(layers, "b")).toBe(1);
  });
  it("returns null when not found", () => {
    expect(style.indexOfLayer(layers, "missing")).toBeNull();
  });
});

describe("getAccessToken", () => {
  it("reads the token from metadata", () => {
    const s = baseStyle({ metadata: { "maputnik:openmaptiles_access_token": "abc" } } as any);
    expect(style.getAccessToken("openmaptiles", s, {})).toBe("abc");
  });
  it("falls back to the bundled token only when allowed", () => {
    const s = baseStyle();
    expect(style.getAccessToken("openmaptiles", s, {})).toBeUndefined();
    expect(style.getAccessToken("openmaptiles", s, { allowFallback: true })).toBeTruthy();
  });
});

describe("replaceAccessTokens", () => {
  it("replaces {key} in a source url and in glyphs", () => {
    const s = baseStyle({
      metadata: { "maputnik:openmaptiles_access_token": "TОKEN" } as any,
      sources: { openmaptiles: { type: "vector", url: "https://api.maptiler.com/x?key={key}" } } as any,
      glyphs: "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key={key}",
    });
    const result = style.replaceAccessTokens(s);
    expect((result.sources.openmaptiles as any).url).toContain("key=TОKEN");
    expect(result.glyphs).toContain("key=TОKEN");
  });

  it("maps thunderforest transport/outdoors sources to the thunderforest token", () => {
    const s = baseStyle({
      metadata: { "maputnik:thunderforest_access_token": "TF" } as any,
      sources: { thunderforest_transport: { type: "vector", url: "https://tile.thunderforest.com/x?apikey={key}" } } as any,
    });
    const result = style.replaceAccessTokens(s);
    expect((result.sources.thunderforest_transport as any).url).toContain("TF");
  });

  it("appends an api_key query param for stadia sources", () => {
    const s = baseStyle({
      metadata: { "maputnik:stadia_access_token": "ST" } as any,
      sources: { basemap: { type: "vector", url: "https://tiles.stadiamaps.com/data/x.json" } } as any,
    });
    const result = style.replaceAccessTokens(s);
    expect((result.sources.basemap as any).url).toContain("api_key=ST");
  });

  it("uses the locationiq token for locationiq sources", () => {
    const s = baseStyle({
      metadata: { "maputnik:locationiq_access_token": "LIQ" } as any,
      sources: { liq: { type: "vector", url: "https://tiles.locationiq.com/v3/x?key={key}" } } as any,
    });
    const result = style.replaceAccessTokens(s);
    expect((result.sources.liq as any).url).toContain("LIQ");
  });

  it("leaves sources without a url or token untouched", () => {
    const s = baseStyle({
      sources: {
        noUrl: { type: "geojson", data: {} } as any,
        noToken: { type: "vector", url: "https://api.maptiler.com/x?key={key}" } as any,
      },
    });
    const result = style.replaceAccessTokens(s);
    expect((result.sources.noToken as any).url).toContain("{key}");
  });
});

describe("stripAccessTokens", () => {
  it("removes provider access tokens from metadata", () => {
    const s = baseStyle({
      metadata: {
        "maputnik:openmaptiles_access_token": "a",
        "maputnik:thunderforest_access_token": "b",
        "maputnik:renderer": "mlgljs",
      } as any,
    });
    const result = style.stripAccessTokens(s);
    expect(result.metadata).not.toHaveProperty("maputnik:openmaptiles_access_token");
    expect(result.metadata).not.toHaveProperty("maputnik:thunderforest_access_token");
    expect((result.metadata as any)["maputnik:renderer"]).toBe("mlgljs");
  });
});
