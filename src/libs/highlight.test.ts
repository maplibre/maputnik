import { describe, it, expect } from "vitest";
import type { LayerSpecification } from "maplibre-gl";
import { colorHighlightedLayer } from "./highlight";

function layer(overrides: Record<string, any>): LayerSpecification {
  return { id: "l", source: "s", "source-layer": "sl", ...overrides } as unknown as LayerSpecification;
}

describe("colorHighlightedLayer", () => {
  it("returns null for undefined, background and raster layers", () => {
    expect(colorHighlightedLayer(undefined)).toBeNull();
    expect(colorHighlightedLayer(layer({ type: "background" }))).toBeNull();
    expect(colorHighlightedLayer(layer({ type: "raster" }))).toBeNull();
  });

  it("builds a circle highlight for circle and symbol layers", () => {
    for (const type of ["circle", "symbol"]) {
      const highlight = colorHighlightedLayer(layer({ type }))!;
      expect(highlight).not.toBeNull();
      expect(highlight.type).toBe("circle");
      expect(highlight.id).toMatch(/_highlight$/);
      expect((highlight.paint as any)["circle-radius"]).toBe(3);
    }
  });

  it("builds a line highlight with an overridden width", () => {
    const highlight = colorHighlightedLayer(layer({ type: "line" }))!;
    expect(highlight.type).toBe("line");
    expect((highlight.paint as any)["line-width"]).toBe(2);
  });

  it("builds a polygon highlight for fill and fill-extrusion layers", () => {
    for (const type of ["fill", "fill-extrusion"]) {
      const highlight = colorHighlightedLayer(layer({ type }))!;
      expect(highlight.type).toBe("fill");
    }
  });

  it("copies the source layer's filter when present, drops it otherwise", () => {
    const withFilter = colorHighlightedLayer(
      layer({ type: "line", filter: ["==", "class", "road"] } as any)
    )!;
    expect(withFilter.filter).toEqual(["==", "class", "road"]);

    const withoutFilter = colorHighlightedLayer(layer({ type: "line" }))!;
    expect("filter" in withoutFilter).toBe(false);
  });
});
