import { describe, it, expect, vi } from "vitest";
import type { Map } from "maplibre-gl";
import LayerWatcher from "./layerwatcher";

function mockMap(): Map {
  return {
    style: {
      tileManagers: {
        vector: { _source: { vectorLayerIds: ["water", "roads"] } },
      },
    },
    querySourceFeatures: () => [
      { properties: { class: "river", name: "A" } },
      { properties: { class: "canal" } },
    ],
  } as unknown as Map;
}

describe("LayerWatcher", () => {
  it("reports sources discovered on the map", () => {
    const onSourcesChange = vi.fn();
    const watcher = new LayerWatcher({ onSourcesChange });

    watcher.analyzeMap(mockMap());
    expect(onSourcesChange).toHaveBeenCalledOnce();
    expect(watcher.sources).toEqual({ vector: ["water", "roads"] });

    // Re-analyzing the same sources does not fire the callback again.
    watcher.analyzeMap(mockMap());
    expect(onSourcesChange).toHaveBeenCalledOnce();
  });

  it("collects vector layer field values from source features", () => {
    const onVectorLayersChange = vi.fn();
    const watcher = new LayerWatcher({ onVectorLayersChange });

    const map = mockMap();
    watcher.analyzeMap(map); // populates _sources
    watcher.analyzeVectorLayerFields(map);

    expect(onVectorLayersChange).toHaveBeenCalled();
    expect(watcher.vectorLayers.water.class).toHaveProperty("river");
    expect(watcher.vectorLayers.water.class).toHaveProperty("canal");
    expect(watcher.vectorLayers.water.name).toHaveProperty("A");
  });
});
