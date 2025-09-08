import type { StyleSpecification } from "maplibre-gl";

export type StyleSpecificationWithId = StyleSpecification & {id: string};

export type OnStyleChangedOpts = {
  save?: boolean;
  addRevision?: boolean;
  initialLoad?: boolean;
}

export type OnStyleChangedCallback = (newStyle: StyleSpecificationWithId, opts: OnStyleChangedOpts={}) => void;

export interface IStyleStore {
  getLatestStyle(): Promise<StyleSpecificationWithId>;
  save(mapStyle: StyleSpecificationWithId): StyleSpecificationWithId;
}
