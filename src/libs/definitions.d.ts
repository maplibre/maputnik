import type { StyleSpecification } from "maplibre-gl";

export type StyleSpecificationWithId = StyleSpecification & {id: string};

export type OnStyleChangedOpts = {
  save?: boolean;
  addRevision?: boolean;
  initialLoad?: boolean;
};

export type OnStyleChangedCallback = (newStyle: StyleSpecificationWithId, opts: OnStyleChangedOpts={}) => void;

export type OnMoveLayerCallback = (move: {oldIndex: number; newIndex: number}) => void;

export interface IStyleStore {
  getLatestStyle(): Promise<StyleSpecificationWithId>;
  save(mapStyle: StyleSpecificationWithId): StyleSpecificationWithId;
}

export type MappedError = {
  message: string
  parsed?: {
    type: "layer"
    data: {
      index: number
      key: string
      message: string
    }
  }
};

export type MappedLayerErrors = {
  [key in LayerSpecification as string]: {message: string}
};
