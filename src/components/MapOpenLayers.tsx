import { throttle } from "lodash";
import React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";

import MapMaplibreGlLayerPopup from "./MapMaplibreGlLayerPopup";

import "ol/ol.css";
import type { StyleSpecification } from "maplibre-gl";
import { Map as OlMap, Overlay, View } from "ol";

import { toLonLat } from "ol/proj";
import { apply } from "ol-mapbox-style";

function renderCoords(coords: string[]) {
  if (!coords || coords.length < 2) {
    return null;
  } else {
    return (
      <span className="maputnik-coords">
        {coords.map((coord) => String(coord).padStart(7, "\u00A0")).join(", ")}
      </span>
    );
  }
}

type MapOpenLayersInternalProps = {
  onDataChange?(...args: unknown[]): unknown;
  mapStyle: object;
  accessToken?: string;
  style?: object;
  onLayerSelect(layerId: string): void;
  debugToolbox: boolean;
  replaceAccessTokens(...args: unknown[]): unknown;
  onChange(...args: unknown[]): unknown;
} & WithTranslation;

type MapOpenLayersState = {
  zoom: string;
  rotation: string;
  cursor: string[];
  center: string[];
  selectedFeatures?: any[];
};

class MapOpenLayersInternal extends React.Component<
  MapOpenLayersInternalProps,
  MapOpenLayersState
> {
  static defaultProps = {
    onMapLoaded: () => {},
    onDataChange: () => {},
    onLayerSelect: () => {},
  };
  updateStyle: any;
  map: any;
  container: HTMLElement | null = null;
  overlay: Overlay | undefined;
  popupContainer: HTMLElement | null = null;

  constructor(props: MapOpenLayersInternalProps) {
    super(props);
    this.state = {
      zoom: "0",
      rotation: "0",
      cursor: [] as string[],
      center: [],
    };
    this.updateStyle = throttle(this._updateStyle.bind(this), 200);
  }

  _updateStyle(newMapStyle: StyleSpecification) {
    if (!this.map) return;

    // See <https://github.com/openlayers/ol-mapbox-style/issues/215#issuecomment-493198815>
    this.map.getLayers().clear();
    apply(this.map, newMapStyle);
  }

  componentDidUpdate(prevProps: MapOpenLayersInternalProps) {
    if (this.props.mapStyle !== prevProps.mapStyle) {
      this.updateStyle(this.props.replaceAccessTokens(this.props.mapStyle));
    }
  }

  componentDidMount() {
    this.overlay = new Overlay({
      element: this.popupContainer!,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    const map = new OlMap({
      target: this.container!,
      overlays: [this.overlay],
      view: new View({
        zoom: 1,
        center: [180, -90],
      }),
    });

    map.on("pointermove", (evt) => {
      const coords = toLonLat(evt.coordinate);
      this.setState({
        cursor: [coords[0].toFixed(2), coords[1].toFixed(2)],
      });
    });

    const onMoveEnd = () => {
      const zoom = map.getView().getZoom();
      const center = toLonLat(map.getView().getCenter()!);

      this.props.onChange({
        zoom,
        center: {
          lng: center[0],
          lat: center[1],
        },
      });
    };

    onMoveEnd();
    map.on("moveend", onMoveEnd);

    map.on("postrender", (_e) => {
      const center = toLonLat(map.getView().getCenter()!);
      this.setState({
        center: [center[0].toFixed(2), center[1].toFixed(2)],
        rotation: map.getView().getRotation().toFixed(2),
        zoom: map.getView().getZoom()?.toFixed(2) ?? "",
      });
    });

    this.map = map;
    this.updateStyle(this.props.replaceAccessTokens(this.props.mapStyle));
  }

  closeOverlay = (e: any) => {
    e.target.blur();
    this.overlay?.setPosition(undefined);
  };

  render() {
    const t = this.props.t;
    return (
      <div className="maputnik-ol-container">
        <div
          ref={(x) => {
            this.popupContainer = x;
          }}
          style={{ background: "black" }}
          className="maputnik-popup"
        >
          <button
            type="button"
            className="maplibregl-popup-close-button"
            onClick={this.closeOverlay}
            aria-label={t("Close popup")}
          >
            ×
          </button>
          <MapMaplibreGlLayerPopup
            features={this.state.selectedFeatures || []}
            onLayerSelect={this.props.onLayerSelect}
          />
        </div>
        <div className="maputnik-ol-zoom">
          {t("Zoom:")} {this.state.zoom}
        </div>
        {this.props.debugToolbox && (
          <div className="maputnik-ol-debug">
            <div>
              <span className="maputnik-ol-debug-label">{t("cursor:")} </span>
              <span>{renderCoords(this.state.cursor)}</span>
            </div>
            <div>
              <span className="maputnik-ol-debug-label">{t("center:")} </span>
              <span>{renderCoords(this.state.center)}</span>
            </div>
            <div>
              <span className="maputnik-ol-debug-label">{t("rotation:")} </span>
              <span>{this.state.rotation}</span>
            </div>
          </div>
        )}
        <section
          className="maputnik-ol"
          ref={(x) => {
            this.container = x;
          }}
          // biome-ignore lint/a11y/useSemanticElements: This container behaves like a region for screen readers
          aria-label={t("Map view")}
          style={{
            ...this.props.style,
          }}
        ></section>
      </div>
    );
  }
}

const MapOpenLayers = withTranslation()(MapOpenLayersInternal);
export default MapOpenLayers;
