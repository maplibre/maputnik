import React, { useEffect, useRef, useState } from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import type {LayerSpecification, SourceSpecification} from "maplibre-gl";

import { InputButton } from "../InputButton";
import { Modal } from "./Modal";
import { FieldType } from "../FieldType";
import { FieldId } from "../FieldId";
import { FieldSource } from "../FieldSource";
import { FieldSourceLayer } from "../FieldSourceLayer";
import { NON_SOURCE_LAYERS } from "../../libs/non-source-layers";

type ModalAddInternalProps = {
  layers: LayerSpecification[]
  onLayersChange(layers: LayerSpecification[]): unknown
  isOpen: boolean
  onOpenToggle(): void
  // A dict of source id's and the available source layers
  sources: Record<string, SourceSpecification & {layers: string[]}>;
} & WithTranslation;

type ModalAddState = {
  type: LayerSpecification["type"]
  id: string
  source?: string
  "source-layer"?: string
  error?: string | null
};

type ModalAddSources = ModalAddInternalProps["sources"];

function getLayersForSource(allSources: ModalAddSources, source: string) {
  const sourceObj = allSources[source] || {};
  return sourceObj.layers || [];
}

function getSources(allSources: ModalAddSources, type: LayerSpecification["type"]) {

  switch(type) {
    case "background":
      return [];
    case "hillshade":
    case "color-relief":
      return Object.entries(allSources).filter(([_, v]) => v.type === "raster-dem").map(([k, _]) => k);
    case "raster":
      return Object.entries(allSources).filter(([_, v]) => v.type === "raster").map(([k, _]) => k);
    case "heatmap":
    case "circle":
    case "fill":
    case "fill-extrusion":
    case "line":
    case "symbol":
      return Object.entries(allSources).filter(([_, v]) => v.type === "vector" || v.type === "geojson").map(([k, _]) => k);
    default:
      return [];
  }
}

const ModalAddInternal: React.FC<ModalAddInternalProps> = (props) => {
  const [type, setType] = useState<LayerSpecification["type"]>("fill");
  const [id, setId] = useState<string>("");
  const [error, setError] = useState<string | null | undefined>(null);
  const [source, setSource] = useState<string | undefined>(() => {
    const sourceIds = Object.keys(props.sources);
    return sourceIds.length > 0 ? sourceIds[0] : undefined;
  });
  const [sourceLayer, setSourceLayer] = useState<string | undefined>(() => {
    const sourceIds = Object.keys(props.sources);
    if (sourceIds.length === 0) return undefined;
    const sourceLayers = props.sources[sourceIds[0]].layers || [];
    return sourceLayers.length > 0 ? sourceLayers[0] : undefined;
  });

  // Mirrors `prevState.type` from the previous `componentDidUpdate`.
  const prevType = useRef<LayerSpecification["type"]>(type);

  useEffect(() => {
    // Check if source is valid for new type
    const oldType = prevType.current;
    prevType.current = type;

    // Only when the type has changed (also skips the initial mount)
    if (oldType === type) return;

    const availableSourcesOld = getSources(props.sources, oldType);
    const availableSourcesNew = getSources(props.sources, type);

    if(
      source !== ""
      // Was a valid source previously
      && availableSourcesOld.indexOf(source!) > -1
      // And is not a valid source now
      && availableSourcesNew.indexOf(source!) < 0
    ) {
      // Clear the source
      setSource("");
    }
  }, [type, source, props.sources]);

  const addLayer = () => {
    if (props.layers.some(l => l.id === id)) {
      setError(props.t("Layer ID already exists"));
      return;
    }

    const changedLayers = props.layers.slice(0);
    const layer: ModalAddState = {
      id: id,
      type: type,
    };

    if(type !== "background") {
      layer.source = source;
      if(!NON_SOURCE_LAYERS.includes(type) && sourceLayer) {
        layer["source-layer"] = sourceLayer;
      }
    }

    changedLayers.push(layer as LayerSpecification);
    setError(null);
    props.onLayersChange(changedLayers);
    props.onOpenToggle();
  };

  const t = props.t;
  const sources = getSources(props.sources, type);
  const layers = getLayersForSource(props.sources, source!);
  let errorElement;
  if (error) {
    errorElement = (
      <div className="maputnik-modal-error">
        {error}
        <a
          href="#"
          onClick={() => setError(null)}
          className="maputnik-modal-error-close"
        >
          ×
        </a>
      </div>
    );
  }

  return <Modal
    isOpen={props.isOpen}
    onOpenToggle={props.onOpenToggle}
    title={t("Add Layer")}
    data-wd-key="modal:add-layer"
    className="maputnik-add-modal"
  >
    {errorElement}
    <div className="maputnik-add-layer">
      <FieldId
        value={id}
        wdKey="add-layer.layer-id"
        onChange={(v: string) => {
          setId(v);
          setError(null);
        }}
      />
      <FieldType
        value={type}
        wdKey="add-layer.layer-type"
        onChange={(v: LayerSpecification["type"]) => setType(v)}
      />
      {type !== "background" &&
      <FieldSource
        sourceIds={sources}
        wdKey="add-layer.layer-source-block"
        value={source}
        onChange={(v: string) => setSource(v)}
      />
      }
      {!NON_SOURCE_LAYERS.includes(type) &&
      <FieldSourceLayer
        sourceLayerIds={layers}
        value={sourceLayer}
        onChange={(v: string) => setSourceLayer(v)}
      />
      }
      <InputButton
        className="maputnik-add-layer-button"
        onClick={addLayer}
        data-wd-key="add-layer"
      >
        {t("Add Layer")}
      </InputButton>
    </div>
  </Modal>;
};

export const ModalAdd = withTranslation()(ModalAddInternal);
