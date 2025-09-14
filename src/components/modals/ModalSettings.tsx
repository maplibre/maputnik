import React from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type {LightSpecification, ProjectionSpecification, StyleSpecification, TerrainSpecification, TransitionSpecification} from "maplibre-gl";
import { type WithTranslation, withTranslation } from "react-i18next";

import FieldArray from "../FieldArray";
import FieldNumber from "../FieldNumber";
import FieldString from "../FieldString";
import FieldUrl from "../FieldUrl";
import FieldSelect from "../FieldSelect";
import FieldEnum from "../FieldEnum";
import FieldColor from "../FieldColor";
import Modal from "./Modal";
import fieldSpecAdditional from "../../libs/field-spec-additional";
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
        <FieldUrl
          fieldSpec={latest.$root.sprite}
          label={t("Sprite URL")}
          data-wd-key="modal:settings.sprite"
          value={this.props.mapStyle.sprite as string}
          onChange={(value) => this.changeStyleProperty("sprite", value)}
        />

        <FieldUrl
          label={t("Glyphs URL")}
          fieldSpec={latest.$root.glyphs}
          data-wd-key="modal:settings.glyphs"
          value={this.props.mapStyle.glyphs as string}
          onChange={(value) => this.changeStyleProperty("glyphs", value)}
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
          onChange={(value) => this.changeStyleProperty("center", value)}
        />

        <FieldNumber
          label={t("Zoom")}
          fieldSpec={latest.$root.zoom}
          value={mapStyle.zoom}
          default={0}
          onChange={(value) => this.changeStyleProperty("zoom", value)}
        />

        <FieldNumber
          label={t("Bearing")}
          fieldSpec={latest.$root.bearing}
          value={mapStyle.bearing}
          default={latest.$root.bearing.default}
          onChange={(value) => this.changeStyleProperty("bearing", value)}
        />

        <FieldNumber
          label={t("Pitch")}
          fieldSpec={latest.$root.pitch}
          value={mapStyle.pitch}
          default={latest.$root.pitch.default}
          onChange={(value) => this.changeStyleProperty("pitch", value)}
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
          fieldSpec={latest.terrain.exaggeration}
          value={terrain.exaggeration}
          default={latest.terrain.exaggeration.default}
          onChange={(value) => this.changeTerrainProperty("exaggeration", value)}
        />

        <FieldNumber
          label={t("Transition delay")}
          fieldSpec={latest.transition.delay}
          value={transition.delay}
          default={latest.transition.delay.default}
          onChange={(value) => this.changeTransitionProperty("delay", value)}
        />

        <FieldNumber
          label={t("Transition duration")}
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
            ["globe", "Globe"]
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
            ["ol", t("Open Layers (experimental)")],
          ]}
          value={metadata["maputnik:renderer"] || "mlgljs"}
          onChange={(value) => onChangeMetadataProperty("maputnik:renderer", value)}
        />
      </div>
    </Modal>;
  }
}

const ModalSettings = withTranslation()(ModalSettingsInternal);
export default ModalSettings;
