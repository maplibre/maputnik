import {latest} from "@maplibre/maplibre-gl-style-spec";
import { type LayerSpecification } from "maplibre-gl";


export function changeType(layer: LayerSpecification, newType: string): LayerSpecification {
  const changedPaintProps: LayerSpecification["paint"] = { ...layer.paint };
  Object.keys(changedPaintProps).forEach(propertyName => {
    if(!(propertyName in latest["paint_" + newType])) {
      delete changedPaintProps[propertyName as keyof LayerSpecification["paint"]];
    }
  });

  const changedLayoutProps: LayerSpecification["layout"] = { ...layer.layout };
  Object.keys(changedLayoutProps).forEach(propertyName => {
    if(!(propertyName in latest["layout_" + newType])) {
      delete changedLayoutProps[propertyName as keyof LayerSpecification["layout"]];
    }
  });

  return {
    ...layer,
    paint: changedPaintProps,
    layout: changedLayoutProps,
    type: newType
  } as LayerSpecification;
}

/** A {@property} in either the paint our layout {@group} has changed
 * to a {@newValue}.
 */
export function changeProperty(layer: LayerSpecification, group: keyof LayerSpecification | null, property: string, newValue: any) {
  // Remove the property if undefined
  if(newValue === undefined) {
    if(group) {
      const newLayer: any = {
        ...layer,
        // Change object so the diff works in ./src/components/map/MaplibreGlMap.jsx
        [group]: {
          ...layer[group] as any
        }
      };
      delete newLayer[group][property];

      // Remove the group if it is now empty
      if(Object.keys(newLayer[group]).length < 1) {
        delete newLayer[group];
      }
      return newLayer;
    } else {
      const newLayer: any = {
        ...layer
      };
      delete newLayer[property];
      return newLayer;
    }
  }
  else {
    if(group) {
      return {
        ...layer,
        [group]: {
          ...layer[group] as any,
          [property]: newValue
        }
      };
    } else {
      return {
        ...layer,
        [property]: newValue
      };
    }
  }
}

export function layerPrefix(name: string) {
  return name.replace(" ", "-").replace("_", "-").split("-")[0];
}

export function findClosestCommonPrefix(layers: LayerSpecification[], idx: number) {
  const currentLayerPrefix = layerPrefix(layers[idx].id);
  let closestIdx = idx;
  for (let i = idx; i > 0; i--) {
    const previousLayerPrefix = layerPrefix(layers[i-1].id);
    if(previousLayerPrefix === currentLayerPrefix) {
      closestIdx = i - 1;
    } else {
      return closestIdx;
    }
  }
  return closestIdx;
}

/** Contiguous layer list groups with more than one layer (same prefix), for collapse UI state. */
export type LayerListGroupRange = {
  prefix: string
  start: number
  end: number
};

export function getLayerListGroupRanges(layers: LayerSpecification[]): LayerListGroupRange[] {
  const out: LayerListGroupRange[] = [];
  let i = 0;
  while (i < layers.length) {
    const prefix = layerPrefix(layers[i].id);
    let j = i + 1;
    while (j < layers.length && layerPrefix(layers[j].id) === prefix) {
      j++;
    }
    if (j - i > 1) {
      out.push({ prefix, start: i, end: j });
    }
    i = j;
  }
  return out;
}

/** True if newIds is oldIds with exactly one id removed (order preserved). */
export function isOneIdRemoved(oldIds: string[], newIds: string[]): boolean {
  if (oldIds.length !== newIds.length + 1) {
    return false;
  }
  let i = 0;
  let j = 0;
  while (i < oldIds.length && j < newIds.length) {
    if (oldIds[i] === newIds[j]) {
      i++;
      j++;
    } else {
      i++;
    }
  }
  return j === newIds.length;
}

function idsForGroupRange(layers: LayerSpecification[], range: LayerListGroupRange): string[] {
  return layers.slice(range.start, range.end).map((l) => l.id);
}

/**
 * Re-key layer list collapse state when layers are deleted/reordered so keys stay aligned with
 * `prefix-startIndex` used by the list UI.
 */
export function remapLayerListCollapsedGroups(
  prevLayers: LayerSpecification[],
  newLayers: LayerSpecification[],
  prevCollapsed: Record<string, boolean>,
): Record<string, boolean> {
  const oldRanges = getLayerListGroupRanges(prevLayers);
  const newRanges = getLayerListGroupRanges(newLayers);
  const next: Record<string, boolean> = {};

  for (const nr of newRanges) {
    const newIds = idsForGroupRange(newLayers, nr);
    const newKey = `${nr.prefix}-${nr.start}`;

    let oldMatch = oldRanges.find((or) => {
      if (or.prefix !== nr.prefix) {
        return false;
      }
      const oldIds = idsForGroupRange(prevLayers, or);
      return oldIds.join("\0") === newIds.join("\0");
    });

    if (!oldMatch) {
      oldMatch = oldRanges.find((or) => {
        if (or.prefix !== nr.prefix) {
          return false;
        }
        const oldIds = idsForGroupRange(prevLayers, or);
        return isOneIdRemoved(oldIds, newIds);
      });
    }

    if (oldMatch && Object.prototype.hasOwnProperty.call(prevCollapsed, `${oldMatch.prefix}-${oldMatch.start}`)) {
      next[newKey] = prevCollapsed[`${oldMatch.prefix}-${oldMatch.start}`];
    }
  }

  return next;
}
