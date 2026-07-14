import React from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type {LightSpecification, ProjectionSpecification, StyleSpecification, TerrainSpecification, TransitionSpecification} from "maplibre-gl";
import { type WithTranslation, withTranslation } from "react-i18next";

import { FieldArray } from "../FieldArray";
import { FieldNumber } from "../FieldNumber";
import { FieldString } from "../FieldString";
import { FieldUrl } from "../FieldUrl";
import { FieldSelect } from "../FieldSelect";
import { FieldEnum } from "../FieldEnum";
import { FieldColor } from "../FieldColor";
import { Modal } from "./Modal";
import { FieldJson } from "../FieldJson";
import { Block } from "../Block";
import { spec as fieldSpecAdditional } from "../../libs/field-spec-additional";
import type {OnStyleChangedCallback, StyleSpecificationWithId} from "../../libs/definitions";

type ModalSettingsInternalProps = {
  mapStyle: StyleSpecificationWithId
  onStyleChanged: OnStyleChangedCallback
  onChangeMetadataProperty(...args: unknown[]): unknown
  isOpen: boolean
  onOpenToggle(): void
} & WithTranslation;

const ModalSettingsInternal: React.FC<ModalSettingsInternalProps> = (props) => {
  function changeTransitionProperty(property: keyof TransitionSpecification, value: number | undefined) {
    const transition = {
      ...props.mapStyle.transition,
    };

    if (value === undefined) {
      delete transition[property];
    }
    else {
      transition[property] = value;
    }

    props.onStyleChanged({
      ...props.mapStyle,
      transition,
    });
  }

  function changeLightProperty(property: keyof LightSpecification, value: any) {
    const light = {
      ...props.mapStyle.light,
    };

    if (value === undefined) {
      delete light[property];
    }
    else {
      // @ts-ignore
      light[property] = value;
    }

    props.onStyleChanged({
      ...props.mapStyle,
      light,
    });
  }

  function changeTerrainProperty(property: keyof TerrainSpecification, value: any) {
    const terrain = {
      ...props.mapStyle.terrain,
    } as TerrainSpecification;

    if (value === undefined) {
      delete terrain[property];
    }
    else {
      // @ts-ignore
      terrain[property] = value;
    }

    props.onStyleChanged({
      ...props.mapStyle,
      terrain,
    });
  }

  function changeProjectionType(value: any) {
    const projection = {
      ...props.mapStyle.projection,
    } as ProjectionSpecification;

    if (value === undefined) {
      delete projection.type;
    }
    else {
      projection.type = value;
    }

    props.onStyleChanged({
      ...props.mapStyle,
      projection,
    });
  }

  function changeStyleProperty(property: keyof StyleSpecification | "owner", value: any) {
    const changedStyle = {
      ...props.mapStyle,
    };

    if (value === undefined) {
      // @ts-ignore
      delete changedStyle[property];
    }
    else {
      // @ts-ignore
      changedStyle[property] = value;
    }
    props.onStyleChanged(changedStyle);
  }

  const metadata = props.mapStyle.metadata || {} as any;
  const {t, onChangeMetadataProperty, mapStyle} = props;
  const fsa = fieldSpecAdditional(t);

  const light = props.mapStyle.light || {};
  const transition = props.mapStyle.transition || {};
  const terrain = props.mapStyle.terrain || {} as TerrainSpecification;
  const projection = props.mapStyle.projection || {} as ProjectionSpecification;

  return <Modal
    data-wd-key="modal:settings"
    isOpen={props.isOpen}
    onOpenToggle={props.onOpenToggle}
    title={t("Style Settings")}
  >
    <div className="modal:settings">
      <FieldString
        label={t("Name")}
        fieldSpec={latest.$root.name}
        data-wd-key="modal:settings.name"
        value={props.mapStyle.name}
        onChange={(value) => changeStyleProperty("name", value)}
      />
      <FieldString
        label={t("Owner")}
        fieldSpec={{doc: t("Owner ID of the style. Used by Mapbox or future style APIs.")}}
        data-wd-key="modal:settings.owner"
        value={(props.mapStyle as any).owner}
        onChange={(value) => changeStyleProperty("owner", value)}
      />
      <Block label={t("Sprite URL")} fieldSpec={latest.$root.sprite} data-wd-key="modal:settings.sprite">
        <FieldJson
          lintType="json"
          value={props.mapStyle.sprite as any}
          onChange={(value) => changeStyleProperty("sprite", value)}
        />
      </Block>

      <FieldUrl
        label={t("Glyphs URL")}
        fieldSpec={latest.$root.glyphs}
        data-wd-key="modal:settings.glyphs"
        value={props.mapStyle.glyphs as string}
        onChange={(value) => changeStyleProperty("glyphs", value)}
      />

      <FieldString
        label={fsa.maputnik.maptiler_access_token.label}
        fieldSpec={fsa.maputnik.maptiler_access_token}
        data-wd-key="modal:settings.maputnik:openmaptiles_access_token"
        value={metadata["maputnik:openmaptiles_access_token"]}
        onChange={(value) => onChangeMetadataProperty("maputnik:openmaptiles_access_token", value)}
      />

      <FieldString
        label={fsa.maputnik.thunderforest_access_token.label}
        fieldSpec={fsa.maputnik.thunderforest_access_token}
        data-wd-key="modal:settings.maputnik:thunderforest_access_token"
        value={metadata["maputnik:thunderforest_access_token"]}
        onChange={(value) => onChangeMetadataProperty("maputnik:thunderforest_access_token", value)}
      />

      <FieldString
        label={fsa.maputnik.stadia_access_token.label}
        fieldSpec={fsa.maputnik.stadia_access_token}
        data-wd-key="modal:settings.maputnik:stadia_access_token"
        value={metadata["maputnik:stadia_access_token"]}
        onChange={(value) => onChangeMetadataProperty("maputnik:stadia_access_token", value)}
      />

      <FieldString
        label={fsa.maputnik.locationiq_access_token.label}
        fieldSpec={fsa.maputnik.locationiq_access_token}
        data-wd-key="modal:settings.maputnik:locationiq_access_token"
        value={metadata["maputnik:locationiq_access_token"]}
        onChange={(value) => onChangeMetadataProperty("maputnik:locationiq_access_token", value)}
      />

      <FieldArray
        label={t("Center")}
        fieldSpec={latest.$root.center}
        length={2}
        type="number"
        value={mapStyle.center || []}
        default={[0, 0]}
        onChange={(value) => changeStyleProperty("center", value)}
      />

      <FieldNumber
        label={t("Zoom")}
        data-wd-key="modal:settings.zoom"
        fieldSpec={latest.$root.zoom}
        value={mapStyle.zoom}
        default={0}
        onChange={(value) => changeStyleProperty("zoom", value)}
      />

      <FieldNumber
        label={t("Bearing")}
        data-wd-key="modal:settings.bearing"
        fieldSpec={latest.$root.bearing}
        value={mapStyle.bearing}
        default={latest.$root.bearing.default}
        onChange={(value) => changeStyleProperty("bearing", value)}
      />

      <FieldNumber
        label={t("Pitch")}
        data-wd-key="modal:settings.pitch"
        fieldSpec={latest.$root.pitch}
        value={mapStyle.pitch}
        default={latest.$root.pitch.default}
        onChange={(value) => changeStyleProperty("pitch", value)}
      />

      <FieldEnum
        label={t("Light anchor")}
        fieldSpec={latest.light.anchor}
        name="light-anchor"
        value={light.anchor as string}
        options={Object.keys(latest.light.anchor.values)}
        default={latest.light.anchor.default}
        onChange={(value) => changeLightProperty("anchor", value)}
      />

      <FieldColor
        label={t("Light color")}
        fieldSpec={latest.light.color}
        value={light.color as string}
        default={latest.light.color.default}
        onChange={(value) => changeLightProperty("color", value)}
      />

      <FieldNumber
        label={t("Light intensity")}
        data-wd-key="modal:settings.light-intensity"
        fieldSpec={latest.light.intensity}
        value={light.intensity as number}
        default={latest.light.intensity.default}
        onChange={(value) => changeLightProperty("intensity", value)}
      />

      <FieldArray
        label={t("Light position")}
        fieldSpec={latest.light.position}
        type="number"
        length={latest.light.position.length}
        value={light.position as number[]}
        default={latest.light.position.default}
        onChange={(value) => changeLightProperty("position", value)}
      />

      <FieldString
        label={t("Terrain source")}
        fieldSpec={latest.terrain.source}
        data-wd-key="modal:settings.maputnik:terrain_source"
        value={terrain.source}
        onChange={(value) => changeTerrainProperty("source", value)}
      />

      <FieldNumber
        label={t("Terrain exaggeration")}
        data-wd-key="modal:settings.terrain-exaggeration"
        fieldSpec={latest.terrain.exaggeration}
        value={terrain.exaggeration}
        default={latest.terrain.exaggeration.default}
        onChange={(value) => changeTerrainProperty("exaggeration", value)}
      />

      <FieldNumber
        label={t("Transition delay")}
        data-wd-key="modal:settings.transition-delay"
        fieldSpec={latest.transition.delay}
        value={transition.delay}
        default={latest.transition.delay.default}
        onChange={(value) => changeTransitionProperty("delay", value)}
      />

      <FieldNumber
        label={t("Transition duration")}
        data-wd-key="modal:settings.transition-duration"
        fieldSpec={latest.transition.duration}
        value={transition.duration}
        default={latest.transition.duration.default}
        onChange={(value) => changeTransitionProperty("duration", value)}
      />

      <FieldSelect
        label={t("Projection")}
        data-wd-key="modal:settings.projection"
        options={[
          ["", "Undefined"],
          ["mercator", "Mercator"],
          ["globe", "Globe"],
          ["vertical-perspective", "Vertical Perspective"]
        ]}
        value={projection?.type?.toString() || ""}
        onChange={(value) => changeProjectionType(value)}
      />

      <FieldSelect
        label={fsa.maputnik.style_renderer.label}
        fieldSpec={fsa.maputnik.style_renderer}
        data-wd-key="modal:settings.maputnik:renderer"
        options={[
          ["mlgljs", "MapLibreGL JS"],
          ["ol", t("Open Layers (experimental)")],
        ]}
        value={metadata["maputnik:renderer"] || "mlgljs"}
        onChange={(value) => onChangeMetadataProperty("maputnik:renderer", value)}
      />
    </div>
  </Modal>;
};

export const ModalSettings = withTranslation()(ModalSettingsInternal);
