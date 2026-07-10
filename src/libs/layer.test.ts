import { describe, it, expect } from "vitest";
import type { LayerSpecification } from "maplibre-gl";
import { changeType, changeProperty, layerPrefix, findClosestCommonPrefix } from "./layer";

describe("changeType", () => {
  it("drops paint/layout props not valid for the new type", () => {
    const layer = {
      id: "l",
      type: "fill",
      source: "s",
      paint: { "fill-color": "#fff", "fill-opacity": 0.5 },
      layout: { visibility: "visible" },
    } as unknown as LayerSpecification;

    const changed = changeType(layer, "background") as any;
    expect(changed.type).toBe("background");
    // fill-color is not a valid background paint property
    expect(changed.paint["fill-color"]).toBeUndefined();
    // visibility is valid for background layout
    expect(changed.layout.visibility).toBe("visible");
  });

  it("keeps props that are valid for the new type", () => {
    const layer = {
      id: "l",
      type: "line",
      source: "s",
      paint: { "line-color": "#000" },
    } as unknown as LayerSpecification;
    const changed = changeType(layer, "line") as any;
    expect(changed.paint["line-color"]).toBe("#000");
  });
});

describe("changeProperty", () => {
  const base = { id: "l", type: "background" } as unknown as LayerSpecification;

  it("sets a top-level property", () => {
    const changed = changeProperty(base, null, "minzoom", 4) as any;
    expect(changed.minzoom).toBe(4);
  });

  it("removes a top-level property when value is undefined", () => {
    const changed = changeProperty({ ...base, minzoom: 4 } as any, null, "minzoom", undefined) as any;
    expect("minzoom" in changed).toBe(false);
  });

  it("sets a grouped property", () => {
    const changed = changeProperty(base, "paint", "background-color", "#fff") as any;
    expect(changed.paint["background-color"]).toBe("#fff");
  });

  it("removes a grouped property and drops the empty group", () => {
    const layer = { ...base, paint: { "background-color": "#fff" } } as any;
    const changed = changeProperty(layer, "paint", "background-color", undefined) as any;
    expect("paint" in changed).toBe(false);
  });

  it("removes a grouped property but keeps a non-empty group", () => {
    const layer = { ...base, paint: { "background-color": "#fff", "background-opacity": 1 } } as any;
    const changed = changeProperty(layer, "paint", "background-color", undefined) as any;
    expect(changed.paint["background-color"]).toBeUndefined();
    expect(changed.paint["background-opacity"]).toBe(1);
  });
});

describe("layerPrefix", () => {
  it("returns the segment before the first separator", () => {
    expect(layerPrefix("foo-bar")).toBe("foo");
    expect(layerPrefix("foo_bar")).toBe("foo");
    expect(layerPrefix("foo bar")).toBe("foo");
    expect(layerPrefix("single")).toBe("single");
  });
});

describe("findClosestCommonPrefix", () => {
  const layers = [
    { id: "aa" },
    { id: "aa-2" },
    { id: "b" },
  ] as unknown as LayerSpecification[];

  it("finds the first index of a run sharing the prefix", () => {
    expect(findClosestCommonPrefix(layers, 1)).toBe(0);
  });

  it("returns the index itself when the previous prefix differs", () => {
    expect(findClosestCommonPrefix(layers, 2)).toBe(2);
  });

  it("returns the index for the first layer", () => {
    expect(findClosestCommonPrefix(layers, 0)).toBe(0);
  });
});
