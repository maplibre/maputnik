import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {throttle} from "lodash";
import { type WithTranslation, withTranslation } from "react-i18next";

import { FeatureLayerPopup as MapMaplibreGlLayerPopup } from "./MapMaplibreGlLayerPopup";

import "ol/ol.css";
//@ts-ignore
import {apply} from "ol-mapbox-style";
import {Map, View, Overlay} from "ol";

import {toLonLat} from "ol/proj";
import type {StyleSpecification} from "maplibre-gl";


function renderCoords (coords: string[]) {
  if (!coords || coords.length < 2) {
    return null;
  }
  else {
    return <span className="maputnik-coords">
      {coords.map((coord) => String(coord).padStart(7, "\u00A0")).join(", ")}
    </span>;
  }
}

type MapOpenLayersInternalProps = {
  onDataChange?(...args: unknown[]): unknown
  mapStyle: object
  accessToken?: string
  style?: object
  onLayerSelect(layerId: string): void
  debugToolbox: boolean
  replaceAccessTokens(...args: unknown[]): unknown
  onChange(...args: unknown[]): unknown
} & WithTranslation;

const MapOpenLayersInternal = ({
  onLayerSelect = () => {},
  mapStyle,
  style,
  debugToolbox,
  replaceAccessTokens,
  onChange,
  t,
}: MapOpenLayersInternalProps) => {
  const [zoom, setZoom] = useState("0");
  const [rotation, setRotation] = useState("0");
  const [cursor, setCursor] = useState<string[]>([]);
  const [center, setCenter] = useState<string[]>([]);
  // Never assigned in the class version either, kept for the popup below.
  const [selectedFeatures] = useState<any[] | undefined>(undefined);

  // Imperative handles: they were plain instance fields, so they are refs and
  // mutating them must not re-render.
  const map = useRef<Map | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const overlay = useRef<Overlay | undefined>(undefined);
  const popupContainer = useRef<HTMLDivElement | null>(null);

  // componentDidUpdate did not run on mount, and componentDidMount already
  // applies the initial style, so the style effect below must skip the mount.
  const hasMounted = useRef(false);

  // The openlayers event handlers are registered on mount but read `this.props`
  // at call time in the class version.
  const latestProps = useRef({mapStyle, replaceAccessTokens, onChange});
  latestProps.current = {mapStyle, replaceAccessTokens, onChange};

  // Was `this.updateStyle = throttle(this._updateStyle.bind(this), 200)` in the
  // constructor: created once per instance, so it is memoized once here.
  const updateStyle = useMemo(() => throttle((newMapStyle: StyleSpecification) => {
    if(!map.current) return;

    // See <https://github.com/openlayers/ol-mapbox-style/issues/215#issuecomment-493198815>
    map.current.getLayers().clear();
    apply(map.current, newMapStyle);
  }, 200), []);

  // componentDidMount
  useEffect(() => {
    overlay.current = new Overlay({
      element: popupContainer.current!,
      autoPan: {
        animation: {
          duration: 250
        }
      },
    });

    const mapInstance = new Map({
      target: container.current!,
      overlays: [overlay.current],
      view: new View({
        zoom: 1,
        center: [180, -90],
      })
    });

    mapInstance.on("pointermove", (evt) => {
      const coords = toLonLat(evt.coordinate);
      setCursor([
        coords[0].toFixed(2),
        coords[1].toFixed(2)
      ]);
    });

    const onMoveEnd = () => {
      const currentZoom = mapInstance.getView().getZoom();
      const currentCenter = toLonLat(mapInstance.getView().getCenter()!);

      latestProps.current.onChange({
        zoom: currentZoom,
        center: {
          lng: currentCenter[0],
          lat: currentCenter[1],
        },
      });
    };

    onMoveEnd();
    mapInstance.on("moveend", onMoveEnd);

    mapInstance.on("postrender", (_e) => {
      const currentCenter = toLonLat(mapInstance.getView().getCenter()!);
      setCenter([
        currentCenter[0].toFixed(2),
        currentCenter[1].toFixed(2),
      ]);
      setRotation(mapInstance.getView().getRotation().toFixed(2));
      setZoom(mapInstance.getView().getZoom()!.toFixed(2));
    });



    map.current = mapInstance;
    updateStyle(
      latestProps.current.replaceAccessTokens(latestProps.current.mapStyle) as StyleSpecification
    );
    // Mount only, like componentDidMount. The class had no componentWillUnmount,
    // so there is no teardown here either. The props read above are read from
    // latestProps/the first render on purpose, so they are not dependencies.
  }, [updateStyle]);

  // componentDidUpdate: `if (this.props.mapStyle !== prevProps.mapStyle)`.
  useEffect(() => {
    if (!hasMounted.current) {
      // componentDidUpdate does not run on mount; componentDidMount already
      // applied the initial style, and applying it twice would push a second
      // (throttled) clear + apply through ol-mapbox-style.
      hasMounted.current = true;
      return;
    }
    updateStyle(
      replaceAccessTokens(mapStyle) as StyleSpecification
    );
    // `replaceAccessTokens` is deliberately *not* a dependency: the parent
    // re-creates it on every render, so depending on it would re-apply the style
    // on every render instead of only when `mapStyle` changes, which is exactly
    // what the `this.props.mapStyle !== prevProps.mapStyle` guard checked.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above: replaceAccessTokens is a new identity each render
  }, [mapStyle, updateStyle]);

  const closeOverlay = useCallback((e: any) => {
    e.target.blur();
    overlay.current!.setPosition(undefined);
  }, []);

  return <div className="maputnik-ol-container">
    <div
      ref={popupContainer}
      style={{background: "black"}}
      className="maputnik-popup"
    >
      <button
        className="maplibregl-popup-close-button"
        onClick={closeOverlay}
        aria-label={t("Close popup")}
      >
        ×
      </button>
      <MapMaplibreGlLayerPopup
        features={selectedFeatures || []}
        onLayerSelect={onLayerSelect}
      />
    </div>
    <div className="maputnik-ol-zoom">
      {t("Zoom:")} {zoom}
    </div>
    {debugToolbox &&
      <div className="maputnik-ol-debug">
        <div>
          <label>{t("cursor:")} </label>
          <span>{renderCoords(cursor)}</span>
        </div>
        <div>
          <label>{t("center:")} </label>
          <span>{renderCoords(center)}</span>
        </div>
        <div>
          <label>{t("rotation:")} </label>
          <span>{rotation}</span>
        </div>
      </div>
    }
    <div
      className="maputnik-ol"
      ref={container}
      role="region"
      aria-label={t("Map view")}
      style={{
        ...style,
      }}>
    </div>
  </div>;
};

export const MapOpenLayers = withTranslation()(MapOpenLayersInternal);
