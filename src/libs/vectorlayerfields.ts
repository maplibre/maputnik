import isEqual from "lodash.isequal";

export type VectorLayerFields = {[layerId: string]: {[propertyName: string]: any}};

export type TileJSON = {
  vector_layers?: {
    id: string
    fields?: {[fieldName: string]: string}
  }[]
};

/** Extract the field names declared in a TileJSON's `vector_layers` schema,
 * keyed by source-layer id. This is known upfront from the tile server's own
 * metadata, so it's available immediately without needing any tiles to have
 * rendered yet. */
export function vectorLayerFieldsFromTileJSON(tileJson: TileJSON): VectorLayerFields {
  const result: VectorLayerFields = {};

  if (!tileJson || !Array.isArray(tileJson.vector_layers)) {
    return result;
  }

  for (const layer of tileJson.vector_layers) {
    if (!layer.fields) {
      continue;
    }

    result[layer.id] = {
      ...result[layer.id],
      ...Object.keys(layer.fields).reduce((acc: {[fieldName: string]: {}}, field: string) => {
        acc[field] = {};
        return acc;
      }, {}),
    };
  }

  return result;
}

/** Merge newly discovered vector layer fields into a previous set, without
 * discarding fields already known from another source (e.g. the TileJSON
 * schema vs. fields observed on already-rendered tiles). Returns the
 * previous object by reference if nothing actually changed, so callers can
 * cheaply skip a re-render. */
export function mergeVectorLayerFields(prev: VectorLayerFields, newFields: VectorLayerFields): VectorLayerFields {
  const merged: VectorLayerFields = {...prev};
  let changed = false;

  for (const layerId of Object.keys(newFields)) {
    const mergedLayer = {...merged[layerId], ...newFields[layerId]};
    if (!isEqual(mergedLayer, merged[layerId])) {
      merged[layerId] = mergedLayer;
      changed = true;
    }
  }

  return changed ? merged : prev;
}
