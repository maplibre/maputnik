import React from "react";
import {latest} from "@maplibre/maplibre-gl-style-spec";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type TFunction } from "i18next";

import { Block } from "../Block";
import { FieldUrl } from "../FieldUrl";
import { FieldNumber } from "../FieldNumber";
import { FieldSelect } from "../FieldSelect";
import { FieldDynamicArray } from "../FieldDynamicArray";
import { FieldArray } from "../FieldArray";
import { FieldJson } from "../FieldJson";
import { FieldCheckbox } from "../FieldCheckbox";


export type EditorMode = "video" | "image" | "tilejson_vector" | "tile_raster" | "tilejson_raster" | "tilexyz_raster-dem" | "tilejson_raster-dem" | "pmtiles_vector" | "tile_vector" | "geojson_url" | "geojson_json" | null;

type TileJSONSourceEditorProps = {
  source: {
    url: string
  }
  onChange(...args: unknown[]): unknown
  children?: React.ReactNode
} & WithTranslation;


const TileJSONSourceEditor: React.FC<TileJSONSourceEditorProps> = (props) => {
  const t = props.t;
  return <div>
    <FieldUrl
      label={t("TileJSON URL")}
      fieldSpec={latest.source_vector.url}
      value={props.source.url}
      onChange={url => props.onChange({
        ...props.source,
        url: url
      })}
    />
    {props.children}
  </div>;
};

type TileURLSourceEditorProps = {
  source: {
    tiles: string[]
    minzoom: number
    maxzoom: number
    scheme: "xyz" | "tms"
  }
  onChange(...args: unknown[]): unknown
  children?: React.ReactNode
} & WithTranslation;

const TileURLSourceEditor: React.FC<TileURLSourceEditorProps> = (props) => {
  function changeTileUrls(tiles: string[]) {
    props.onChange({
      ...props.source,
      tiles,
    });
  }

  function renderTileUrls() {
    const tiles = props.source.tiles || [];
    return <FieldDynamicArray
      label={props.t("Tile URL")}
      fieldSpec={latest.source_vector.tiles}
      type="url"
      value={tiles}
      onChange={changeTileUrls}
    />;
  }

  const t = props.t;
  return <div>
    {renderTileUrls()}
    <FieldSelect
      label={t("Scheme Type")}
      fieldSpec={latest.source_vector.scheme}
      options={[
        ["xyz", "xyz (Slippy map tilenames scheme)"],
        ["tms", "tms (OSGeo spec scheme)"],
      ]}
      onChange={scheme => props.onChange({
        ...props.source,
        scheme
      })}
      value={props.source.scheme}
      data-wd-key="modal:sources.add.scheme_type"
    />
    <FieldNumber
      label={t("Min Zoom")}
      fieldSpec={latest.source_vector.minzoom}
      value={props.source.minzoom || 0}
      onChange={minzoom => props.onChange({
        ...props.source,
        minzoom: minzoom
      })}
    />
    <FieldNumber
      label={t("Max Zoom")}
      fieldSpec={latest.source_vector.maxzoom}
      value={props.source.maxzoom || 22}
      onChange={maxzoom => props.onChange({
        ...props.source,
        maxzoom: maxzoom
      })}
    />
    {props.children}
  </div>;
};

const createCornerLabels: (t: TFunction) => { label: string, key: string }[] = (t) => ([
  { label: t("Coord top left"), key: "top left" },
  { label: t("Coord top right"), key: "top right" },
  { label: t("Coord bottom right"), key: "bottom right" },
  { label: t("Coord bottom left"), key: "bottom left" },
]);

type ImageSourceEditorProps = {
  source: {
    coordinates: [number, number][]
    url: string
  }
  onChange(...args: unknown[]): unknown
} & WithTranslation;

const ImageSourceEditor: React.FC<ImageSourceEditorProps> = (props) => {
  const t = props.t;
  const changeCoord = (idx: number, val: [number, number]) => {
    const coordinates = props.source.coordinates.slice(0);
    coordinates[idx] = val;

    props.onChange({
      ...props.source,
      coordinates,
    });
  };

  return <div>
    <FieldUrl
      label={t("Image URL")}
      fieldSpec={latest.source_image.url}
      value={props.source.url}
      onChange={url => props.onChange({
        ...props.source,
        url,
      })}
    />
    {createCornerLabels(t).map(({label, key}, idx) => {
      return (
        <FieldArray
          label={label}
          key={key}
          length={2}
          type="number"
          value={props.source.coordinates[idx]}
          default={[0, 0]}
          onChange={(val: [number, number]) => changeCoord(idx, val)}
        />
      );
    })}
  </div>;
};

type VideoSourceEditorProps = {
  source: {
    coordinates: [number, number][]
    urls: string[]
  }
  onChange(...args: unknown[]): unknown
} & WithTranslation;

const VideoSourceEditor: React.FC<VideoSourceEditorProps> = (props) => {
  const t = props.t;
  const changeCoord = (idx: number, val: [number, number]) => {
    const coordinates = props.source.coordinates.slice(0);
    coordinates[idx] = val;

    props.onChange({
      ...props.source,
      coordinates,
    });
  };

  const changeUrls = (urls: string[]) => {
    props.onChange({
      ...props.source,
      urls,
    });
  };

  return <div>
    <FieldDynamicArray
      label={t("Video URL")}
      fieldSpec={latest.source_video.urls}
      type="string"
      value={props.source.urls}
      default={[]}
      onChange={changeUrls}
    />
    {createCornerLabels(t).map(({label, key}, idx) => {
      return (
        <FieldArray
          label={label}
          key={key}
          length={2}
          type="number"
          value={props.source.coordinates[idx]}
          default={[0, 0]}
          onChange={(val: [number, number]) => changeCoord(idx, val)}
        />
      );
    })}
  </div>;
};

type GeoJSONSourceUrlEditorProps = {
  source: {
    data: string
  }
  onChange(...args: unknown[]): unknown
} & WithTranslation;

const GeoJSONSourceUrlEditor: React.FC<GeoJSONSourceUrlEditorProps> = (props) => {
  const t = props.t;
  return <FieldUrl
    label={t("GeoJSON URL")}
    fieldSpec={latest.source_geojson.data}
    value={props.source.data}
    onChange={data => props.onChange({
      ...props.source,
      data: data
    })}
  />;
};

type GeoJSONSourceFieldJsonEditorProps = {
  source: {
    data: any,
    cluster: boolean
  }
  onChange(...args: unknown[]): unknown
} & WithTranslation;

const GeoJSONSourceFieldJsonEditor: React.FC<GeoJSONSourceFieldJsonEditorProps> = (props) => {
  const t = props.t;
  return <div>
    <Block label={t("GeoJSON")} fieldSpec={latest.source_geojson.data}>
      <FieldJson
        value={props.source.data}
        lintType="json"
        onChange={data => {
          props.onChange({
            ...props.source,
            data,
          });
        }}
      />
    </Block>
    <FieldCheckbox
      label={t("Cluster")}
      value={props.source.cluster}
      onChange={cluster => {
        props.onChange({
          ...props.source,
          cluster: cluster,
        });
      }}
    />
  </div>;
};

type PMTilesSourceEditorProps = {
  source: {
    url: string
  }
  onChange(...args: unknown[]): unknown
  children?: React.ReactNode
} & WithTranslation;

const PMTilesSourceEditor: React.FC<PMTilesSourceEditorProps> = (props) => {
  const t = props.t;
  return <div>
    <FieldUrl
      label={t("PMTiles URL")}
      fieldSpec={latest.source_vector.url}
      value={props.source.url}
      data-wd-key="modal:sources.add.source_url"
      onChange={(url: string) => props.onChange({
        ...props.source,
        url: url.startsWith("pmtiles://") ? url : `pmtiles://${url}`
      })}
    />
    {props.children}
  </div>;
};

type ModalSourcesTypeEditorInternalProps = {
  mode: EditorMode
  source: any
  onChange(...args: unknown[]): unknown
} & WithTranslation;

const ModalSourcesTypeEditorInternal: React.FC<ModalSourcesTypeEditorInternalProps> = (props) => {
  const t = props.t;
  const commonProps = {
    source: props.source,
    onChange: props.onChange,
    t: props.t,
    i18n: props.i18n,
    tReady: props.tReady,
  };
  switch(props.mode) {
    case "geojson_url": return <GeoJSONSourceUrlEditor {...commonProps} />;
    case "geojson_json": return <GeoJSONSourceFieldJsonEditor {...commonProps} />;
    case "tilejson_vector": return <TileJSONSourceEditor {...commonProps} />;
    case "tile_vector": return <TileURLSourceEditor {...commonProps} />;
    case "tilejson_raster": return <TileJSONSourceEditor {...commonProps} />;
    case "tile_raster": return <TileURLSourceEditor {...commonProps}>
      <FieldNumber
        label={t("Tile Size")}
        fieldSpec={latest.source_raster.tileSize}
        onChange={tileSize => props.onChange({
          ...props.source,
          tileSize: tileSize
        })}
        value={props.source.tileSize || latest.source_raster.tileSize.default}
        data-wd-key="modal:sources.add.tile_size"
      />
    </TileURLSourceEditor>;
    case "tilejson_raster-dem": return <TileJSONSourceEditor {...commonProps} />;
    case "tilexyz_raster-dem": return <TileURLSourceEditor {...commonProps}>
      <FieldNumber
        label={t("Tile Size")}
        fieldSpec={latest.source_raster_dem.tileSize}
        onChange={tileSize => props.onChange({
          ...props.source,
          tileSize: tileSize
        })}
        value={props.source.tileSize || latest.source_raster_dem.tileSize.default}
        data-wd-key="modal:sources.add.tile_size"
      />
      <FieldSelect
        label={t("Encoding")}
        fieldSpec={latest.source_raster_dem.encoding}
        options={Object.keys(latest.source_raster_dem.encoding.values)}
        onChange={encoding => props.onChange({
          ...props.source,
          encoding: encoding
        })}
        value={props.source.encoding || latest.source_raster_dem.encoding.default}
      />
    </TileURLSourceEditor>;
    case "pmtiles_vector": return <PMTilesSourceEditor {...commonProps} />;
    case "image": return <ImageSourceEditor {...commonProps} />;
    case "video": return <VideoSourceEditor {...commonProps} />;
    default: return null;
  }
};

export const ModalSourcesTypeEditor = withTranslation()(ModalSourcesTypeEditorInternal);
