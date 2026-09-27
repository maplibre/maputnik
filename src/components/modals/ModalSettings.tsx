import React from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type {LightSpecification, ProjectionSpecification, SkySpecification, StyleSpecification, TerrainSpecification, TransitionSpecification} from "maplibre-gl";
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

class ModalSettingsInternal extends React.Component<ModalSettingsInternalProps> {
  changeTransitionProperty(property: keyof TransitionSpecification, value: number | undefined) {
    const transition = {
      ...this.props.mapStyle.transition,
    };

    if (value === undefined) {
      delete transition[property];
    }
    else {
      transition[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      transition,
    });
  }

  changeLightProperty(property: keyof LightSpecification, value: any) {
    const light = {
      ...this.props.mapStyle.light,
    };

    if (value === undefined) {
      delete light[property];
    }
    else {
      // @ts-ignore
      light[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      light,
    });
  }

  changeTerrainProperty(property: keyof TerrainSpecification, value: any) {
    const terrain = {
      ...this.props.mapStyle.terrain,
    } as TerrainSpecification;

    if (value === undefined) {
      delete terrain[property];
    }
    else {
      // @ts-ignore
      terrain[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      terrain,
    });
  }

  changeSkyProperty(property: keyof SkySpecification, value: any) {
    const sky = {
      ...this.props.mapStyle.sky,
    };

    if (value === undefined) {
      delete sky[property];
    }
    else {
      sky[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      sky,
    });
  }

  changeProjectionType(value: any) {
    const projection = {
      ...this.props.mapStyle.projection,
    } as ProjectionSpecification;

    if (value === undefined) {
      delete projection.type;
    }
    else {
      projection.type = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      projection,
    });
  }

  changeStyleProperty(property: keyof StyleSpecification | "owner", value: any) {
    const changedStyle = {
      ...this.props.mapStyle,
    };

    if (value === undefined) {
      // @ts-ignore
      delete changedStyle[property];
    }
    else {
      // @ts-ignore
      changedStyle[property] = value;
    }
    this.props.onStyleChanged(changedStyle);
  }

  render() {
    const metadata = this.props.mapStyle.metadata || {} as any;
    const {t, onChangeMetadataProperty, mapStyle} = this.props;
    const fsa = fieldSpecAdditional(t);

    const light = this.props.mapStyle.light || {};
    const transition = this.props.mapStyle.transition || {};
    const terrain = this.props.mapStyle.terrain || {} as TerrainSpecification;
    const projection = this.props.mapStyle.projection || {} as ProjectionSpecification;
    const sky = this.props.mapStyle.sky || {};

    return <Modal
      data-wd-key="modal:settings"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={t("Style Settings")}
    >
      <div className="modal:settings">
        <FieldString
          label={t("Name")}
          fieldSpec={latest.$root.name}
          data-wd-key="modal:settings.name"
          value={this.props.mapStyle.name}
          onChange={(value) => this.changeStyleProperty("name", value)}
        />
        <FieldString
          label={t("Owner")}
          fieldSpec={{doc: t("Owner ID of the style. Used by Mapbox or future style APIs.")}}
          data-wd-key="modal:settings.owner"
          value={(this.props.mapStyle as any).owner}
          onChange={(value) => this.changeStyleProperty("owner", value)}
        />
        <Block label={t("Sprite URL")} fieldSpec={latest.$root.sprite} data-wd-key="modal:settings.sprite">
          <FieldJson
            lintType="json"
            value={this.props.mapStyle.sprite as any}
            onChange={(value) => this.changeStyleProperty("sprite", value)}
          />
        </Block>

        <FieldUrl
          label={t("Glyphs URL")}
          fieldSpec={latest.$root.glyphs}
          data-wd-key="modal:settings.glyphs"
          value={this.props.mapStyle.glyphs as string}
          onChange={(value) => this.changeStyleProperty("glyphs", value)}
        />

        <Block label={t("Font faces")} fieldSpec={latest.$root["font-faces"]} data-wd-key="modal:settings.font-faces">
          <FieldJson
            lintType="json"
            value={this.props.mapStyle["font-faces"] as any}
            onChange={(value) => this.changeStyleProperty("font-faces", value)}
          />
        </Block>

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
          onChange={(value) => this.changeStyleProperty("center", value)}
        />

        <FieldNumber
          label={t("Zoom")}
          data-wd-key="modal:settings.zoom"
          fieldSpec={latest.$root.zoom}
          value={mapStyle.zoom}
          default={0}
          onChange={(value) => this.changeStyleProperty("zoom", value)}
        />

        <FieldNumber
          label={t("Bearing")}
          data-wd-key="modal:settings.bearing"
          fieldSpec={latest.$root.bearing}
          value={mapStyle.bearing}
          default={latest.$root.bearing.default}
          onChange={(value) => this.changeStyleProperty("bearing", value)}
        />

        <FieldNumber
          label={t("Pitch")}
          data-wd-key="modal:settings.pitch"
          fieldSpec={latest.$root.pitch}
          value={mapStyle.pitch}
          default={latest.$root.pitch.default}
          onChange={(value) => this.changeStyleProperty("pitch", value)}
        />

        <FieldNumber
          label={t("Roll")}
          data-wd-key="modal:settings.roll"
          fieldSpec={latest.$root.roll}
          value={mapStyle.roll}
          default={latest.$root.roll.default}
          onChange={(value) => this.changeStyleProperty("roll", value)}
        />

        <FieldNumber
          label={t("Center altitude")}
          data-wd-key="modal:settings.center-altitude"
          fieldSpec={latest.$root.centerAltitude}
          value={mapStyle.centerAltitude}
          onChange={(value) => this.changeStyleProperty("centerAltitude", value)}
        />

        <FieldEnum
          label={t("Light anchor")}
          fieldSpec={latest.light.anchor}
          name="light-anchor"
          value={light.anchor as string}
          options={Object.keys(latest.light.anchor.values)}
          default={latest.light.anchor.default}
          onChange={(value) => this.changeLightProperty("anchor", value)}
        />

        <FieldColor
          label={t("Light color")}
          fieldSpec={latest.light.color}
          value={light.color as string}
          default={latest.light.color.default}
          onChange={(value) => this.changeLightProperty("color", value)}
        />

        <FieldNumber
          label={t("Light intensity")}
          data-wd-key="modal:settings.light-intensity"
          fieldSpec={latest.light.intensity}
          value={light.intensity as number}
          default={latest.light.intensity.default}
          onChange={(value) => this.changeLightProperty("intensity", value)}
        />

        <FieldArray
          label={t("Light position")}
          fieldSpec={latest.light.position}
          type="number"
          length={latest.light.position.length}
          value={light.position as number[]}
          default={latest.light.position.default}
          onChange={(value) => this.changeLightProperty("position", value)}
        />

        <FieldString
          label={t("Terrain source")}
          fieldSpec={latest.terrain.source}
          data-wd-key="modal:settings.maputnik:terrain_source"
          value={terrain.source}
          onChange={(value) => this.changeTerrainProperty("source", value)}
        />

        <FieldNumber
          label={t("Terrain exaggeration")}
          data-wd-key="modal:settings.terrain-exaggeration"
          fieldSpec={latest.terrain.exaggeration}
          value={terrain.exaggeration}
          default={latest.terrain.exaggeration.default}
          onChange={(value) => this.changeTerrainProperty("exaggeration", value)}
        />

        <FieldColor
          label={t("Sky color")}
          fieldSpec={latest.sky["sky-color"]}
          value={sky["sky-color"] as string}
          default={latest.sky["sky-color"].default}
          onChange={(value) => this.changeSkyProperty("sky-color", value)}
        />

        <FieldColor
          label={t("Horizon color")}
          fieldSpec={latest.sky["horizon-color"]}
          value={sky["horizon-color"] as string}
          default={latest.sky["horizon-color"].default}
          onChange={(value) => this.changeSkyProperty("horizon-color", value)}
        />

        <FieldColor
          label={t("Fog color")}
          fieldSpec={latest.sky["fog-color"]}
          value={sky["fog-color"] as string}
          default={latest.sky["fog-color"].default}
          onChange={(value) => this.changeSkyProperty("fog-color", value)}
        />

        <FieldNumber
          label={t("Sky horizon blend")}
          data-wd-key="modal:settings.sky-horizon-blend"
          fieldSpec={latest.sky["sky-horizon-blend"]}
          value={sky["sky-horizon-blend"] as number}
          default={latest.sky["sky-horizon-blend"].default}
          onChange={(value) => this.changeSkyProperty("sky-horizon-blend", value)}
        />

        <FieldNumber
          label={t("Horizon fog blend")}
          data-wd-key="modal:settings.horizon-fog-blend"
          fieldSpec={latest.sky["horizon-fog-blend"]}
          value={sky["horizon-fog-blend"] as number}
          default={latest.sky["horizon-fog-blend"].default}
          onChange={(value) => this.changeSkyProperty("horizon-fog-blend", value)}
        />

        <FieldNumber
          label={t("Fog ground blend")}
          data-wd-key="modal:settings.fog-ground-blend"
          fieldSpec={latest.sky["fog-ground-blend"]}
          value={sky["fog-ground-blend"] as number}
          default={latest.sky["fog-ground-blend"].default}
          onChange={(value) => this.changeSkyProperty("fog-ground-blend", value)}
        />

        <FieldNumber
          label={t("Atmosphere blend")}
          data-wd-key="modal:settings.atmosphere-blend"
          fieldSpec={latest.sky["atmosphere-blend"]}
          value={sky["atmosphere-blend"] as number}
          default={latest.sky["atmosphere-blend"].default}
          onChange={(value) => this.changeSkyProperty("atmosphere-blend", value)}
        />

        <FieldNumber
          label={t("Transition delay")}
          data-wd-key="modal:settings.transition-delay"
          fieldSpec={latest.transition.delay}
          value={transition.delay}
          default={latest.transition.delay.default}
          onChange={(value) => this.changeTransitionProperty("delay", value)}
        />

        <FieldNumber
          label={t("Transition duration")}
          data-wd-key="modal:settings.transition-duration"
          fieldSpec={latest.transition.duration}
          value={transition.duration}
          default={latest.transition.duration.default}
          onChange={(value) => this.changeTransitionProperty("duration", value)}
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
          onChange={(value) => this.changeProjectionType(value)}
        />

        <FieldSelect
          label={fsa.maputnik.style_renderer.label}
          fieldSpec={fsa.maputnik.style_renderer}
          data-wd-key="modal:settings.maputnik:renderer"
          options={[
            ["mlgljs", "MapLibreGL JS"],
            ["ol", t("OpenLayers (experimental)")],
          ]}
          value={metadata["maputnik:renderer"] || "mlgljs"}
          onChange={(value) => onChangeMetadataProperty("maputnik:renderer", value)}
        />
      </div>
    </Modal>;
  }
}

export const ModalSettings = withTranslation()(ModalSettingsInternal);
