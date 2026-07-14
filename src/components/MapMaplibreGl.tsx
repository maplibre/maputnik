import React, {useCallback, useEffect, useReducer, useRef} from "react";
import {createRoot} from "react-dom/client";
import MapLibreGl, {type LayerSpecification, type LngLat, type Map, type MapOptions, type SourceSpecification, type StyleSpecification} from "maplibre-gl";
import MaplibreInspect from "@maplibre/maplibre-gl-inspect";
import colors from "@maplibre/maplibre-gl-inspect/lib/colors";
import { FeatureLayerPopup as MapMaplibreGlLayerPopup } from "./MapMaplibreGlLayerPopup";
import { FeaturePropertyPopup as MapMaplibreGlFeaturePropertyPopup, type InspectFeature } from "./MapMaplibreGlFeaturePropertyPopup";
import Color from "color";
import { ZoomControl } from "../libs/zoomcontrol";
import { type HighlightedLayer, colorHighlightedLayer } from "../libs/highlight";
import "maplibre-gl/dist/maplibre-gl.css";
import "../maplibregl.css";
import "../libs/maplibre-rtl";
import MaplibreGeocoder, { type MaplibreGeocoderApi, type MaplibreGeocoderApiConfig } from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { withTranslation, type WithTranslation } from "react-i18next";
import i18next from "i18next";
import { Protocol } from "pmtiles";

function buildInspectStyle(originalMapStyle: StyleSpecification, coloredLayers: HighlightedLayer[], highlightedLayer?: HighlightedLayer) {
  const backgroundLayer = {
    "id": "background",
    "type": "background",
    "paint": {
      "background-color": "#1c1f24",
    }
  } as LayerSpecification;

  const layer = colorHighlightedLayer(highlightedLayer);
  if(layer) {
    coloredLayers.push(layer);
  }

  const sources: {[key:string]: SourceSpecification} = {};

  Object.keys(originalMapStyle.sources).forEach(sourceId => {
    const source = originalMapStyle.sources[sourceId];
    if(source.type !== "raster" && source.type !== "raster-dem") {
      sources[sourceId] = source;
    }
  });

  const inspectStyle = {
    ...originalMapStyle,
    sources: sources,
    layers: [backgroundLayer].concat(coloredLayers as LayerSpecification[])
  };
  return inspectStyle;
}

type MapMaplibreGlInternalProps = {
  onDataChange?(event: {map: Map | null}): unknown
  onLayerSelect(index: number): void
  mapStyle: StyleSpecification
  mapView: {
    zoom: number,
    center: {
      lng: number,
      lat: number,
    },
    _from: "map" | "app"
  };
  inspectModeEnabled: boolean
  highlightedLayer?: HighlightedLayer
  options?: Partial<MapOptions> & {
    showTileBoundaries?: boolean
    showCollisionBoxes?: boolean
    showOverdrawInspector?: boolean
  }
  replaceAccessTokens(mapStyle: StyleSpecification): StyleSpecification
  onChange(value: {center: LngLat, zoom: number, _from: "map" | "app"}): unknown
} & WithTranslation;

/**
 * Replacement for the previous `shouldComponentUpdate`. `React.memo` expects the
 * inverse: `true` means "props are equal, skip the render", whereas
 * `shouldComponentUpdate` returned `true` when it *should* re-render.
 * As before, if the props cannot be serialized we treat them as equal and skip
 * the render ("no biggie, carry on").
 */
function arePropsEqual(prevProps: MapMaplibreGlInternalProps, nextProps: MapMaplibreGlInternalProps) {
  let should = false;
  try {
    should = JSON.stringify(prevProps) !== JSON.stringify(nextProps);
  } catch(_e) {
    // no biggie, carry on
  }
  return !should;
}

const MapMaplibreGlInternal = ({
  onDataChange = () => {},
  onLayerSelect = () => {},
  onChange = () => {},
  options = {},
  mapStyle,
  mapView,
  inspectModeEnabled,
  highlightedLayer,
  replaceAccessTokens,
  t,
}: MapMaplibreGlInternalProps) => {
  const container = useRef<HTMLDivElement | null>(null);

  // These used to live in `this.state`, but were never able to trigger a
  // re-render: `shouldComponentUpdate` stringified the state, which throws for
  // the (circular) maplibre `Map`, so the comparison was swallowed and the
  // component only ever re-rendered on prop changes. They are imperative
  // handles, so they are refs here and mutating them does not re-render.
  const map = useRef<Map | null>(null);
  const inspect = useRef<MaplibreInspect | null>(null);
  const geocoder = useRef<MaplibreGeocoder | null>(null);
  const zoomControl = useRef<ZoomControl | null>(null);
  const zoom = useRef<number | undefined>(undefined);

  // `componentDidUpdate` did not run on mount, so neither may the effect below.
  const hasMounted = useRef(false);

  const [, forceUpdate] = useReducer((tick: number) => tick + 1, 0);

  // The maplibre event handlers/callbacks below are registered once (on mount)
  // but read `this.props` at call time in the class version, so they must not
  // close over the props of the first render.
  const latestProps = useRef({onDataChange, onLayerSelect, onChange, mapStyle, inspectModeEnabled, highlightedLayer, t});
  latestProps.current = {onDataChange, onLayerSelect, onChange, mapStyle, inspectModeEnabled, highlightedLayer, t};

  const onLayerSelectById = useCallback((id: string) => {
    const index = latestProps.current.mapStyle.layers.findIndex(layer => layer.id === id);
    latestProps.current.onLayerSelect(index);
  }, []);

  const initGeocoder = useCallback((mapInstance: Map) => {
    const geocoderConfig = {
      forwardGeocode: async (config: MaplibreGeocoderApiConfig) => {
        const features = [];
        try {
          const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
          const response = await fetch(request);
          const geojson = await response.json();
          for (const feature of geojson.features) {
            const center = [
              feature.bbox[0] +
                  (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] +
                  (feature.bbox[3] - feature.bbox[1]) / 2
            ];
            const point = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center
              },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ["place"],
              center
            };
            features.push(point);
          }
        } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
        }
        return {
          features
        };
      },
    } as unknown as MaplibreGeocoderApi;
    const geocoderInstance = new MaplibreGeocoder(geocoderConfig, {
      placeholder: latestProps.current.t("Search"),
      maplibregl: MapLibreGl,
    });
    mapInstance.addControl(geocoderInstance, "top-left");
    return geocoderInstance;
  }, []);

  // Was the `i18next.on("languageChanged", () => this.forceUpdate())` in the
  // constructor. `forceUpdate` bypassed `shouldComponentUpdate`; a state update
  // likewise bypasses `React.memo`.
  useEffect(() => {
    const onLanguageChanged = () => {
      forceUpdate();
    };
    i18next.on("languageChanged", onLanguageChanged);
    return () => {
      i18next.off("languageChanged", onLanguageChanged);
    };
  }, []);

  // componentDidMount
  useEffect(() => {
    const mapOpts = {
      ...options,
      container: container.current!,
      style: mapStyle,
      hash: true,
      maxZoom: 24,
      // make root relative urls in stylefiles work as maplibre gl js does
      // not support this for everything:
      // https://github.com/maplibre/maplibre-gl-js/issues/6818
      transformRequest: (url) => {
        if (url.startsWith("/")) {
          url = `${window.location.origin}${url}`;
        }
        return { url };
      },
      // setting to always load glyphs of CJK fonts from server
      // https://maplibre.org/maplibre-gl-js/docs/examples/local-ideographs/
      localIdeographFontFamily: false
    } satisfies MapOptions;

    const protocol = new Protocol({metadata: true});
    MapLibreGl.addProtocol("pmtiles",protocol.tile);
    const mapInstance = new MapLibreGl.Map(mapOpts);

    const mapViewChange = () => {
      const center = mapInstance.getCenter();
      const currentZoom = mapInstance.getZoom();
      latestProps.current.onChange({center, zoom: currentZoom, _from: "map"});
    };
    mapViewChange();

    mapInstance.showTileBoundaries = mapOpts.showTileBoundaries!;
    mapInstance.showCollisionBoxes = mapOpts.showCollisionBoxes!;
    mapInstance.showOverdrawInspector = mapOpts.showOverdrawInspector!;

    const geocoderInstance = initGeocoder(mapInstance);

    const zoomControlInstance = new ZoomControl();
    mapInstance.addControl(zoomControlInstance, "top-right");

    const nav = new MapLibreGl.NavigationControl({visualizePitch:true});
    mapInstance.addControl(nav, "top-right");

    const tmpNode = document.createElement("div");
    const root = createRoot(tmpNode);

    const inspectPopup = new MapLibreGl.Popup({
      closeOnClick: false
    });

    const inspectInstance = new MaplibreInspect({
      popup: inspectPopup,
      showMapPopup: true,
      showMapPopupOnHover: false,
      showInspectMapPopupOnHover: true,
      showInspectButton: false,
      blockHoverPopupOnClick: true,
      assignLayerColor: (layerId: string, alpha: number) => {
        return Color(colors.brightColor(layerId, alpha)).desaturate(0.5).string();
      },
      buildInspectStyle: (originalMapStyle: StyleSpecification, coloredLayers: HighlightedLayer[]) => buildInspectStyle(originalMapStyle, coloredLayers, latestProps.current.highlightedLayer),
      renderPopup: (features: InspectFeature[]) => {
        if(latestProps.current.inspectModeEnabled) {
          inspectPopup.once("open", () => {
            root.render(<MapMaplibreGlFeaturePropertyPopup features={features} />);
          });
          return tmpNode;
        } else {
          inspectPopup.once("open", () => {
            root.render(<MapMaplibreGlLayerPopup
              features={features}
              onLayerSelect={onLayerSelectById}
              zoom={zoom.current}
            />,);
          });
          return tmpNode;
        }
      }
    });
    mapInstance.addControl(inspectInstance);

    mapInstance.on("style.load", () => {
      map.current = mapInstance;
      inspect.current = inspectInstance;
      geocoder.current = geocoderInstance;
      zoomControl.current = zoomControlInstance;
      zoom.current = mapInstance.getZoom();
    });

    mapInstance.on("data", e => {
      if(e.dataType !== "tile") return;
      latestProps.current.onDataChange!({
        map: map.current
      });
    });

    mapInstance.on("error", e => {
      console.log("ERROR", e);
    });

    mapInstance.on("zoom", _e => {
      zoom.current = mapInstance.getZoom();
    });

    mapInstance.on("dragend", mapViewChange);
    mapInstance.on("zoomend", mapViewChange);
    // Mount only, exactly like componentDidMount: the map is created from the
    // props of the first render and kept up to date imperatively below (the
    // handlers read `latestProps`, so no prop belongs in the dependencies). The
    // class had no componentWillUnmount, so there is no teardown here either.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: adding mapStyle/options would re-create the map
  }, [initGeocoder, onLayerSelectById]);

  // componentDidUpdate. It had no `prevProps` guards, so it ran after *every*
  // re-render; the equivalent is an effect without a dependency array. Since the
  // component only re-renders when `arePropsEqual` reports a prop change (or on
  // a language change, as before), this runs exactly as often as it used to.
  useEffect(() => {
    if (!hasMounted.current) {
      // componentDidUpdate does not run on mount.
      hasMounted.current = true;
      return;
    }

    const styleWithTokens = replaceAccessTokens(mapStyle);
    if (map.current) {
      // Maplibre GL now does diffing natively so we don't need to calculate
      // the necessary operations ourselves!
      // We also need to update the style for inspect to work properly
      map.current.setStyle(styleWithTokens, {diff: true});
      map.current.showTileBoundaries = options?.showTileBoundaries!;
      map.current.showCollisionBoxes = options?.showCollisionBoxes!;
      map.current.showOverdrawInspector = options?.showOverdrawInspector!;

      // set the map view when the prop was updated from outside
      if (mapView._from === "app") {
        map.current.jumpTo(mapView);
      }
    }

    if(inspect.current && inspectModeEnabled !== inspect.current._showInspectMap) {
      inspect.current.toggleInspector();
    }
    if (inspect.current && inspectModeEnabled) {
      inspect.current.setOriginalStyle(styleWithTokens);
      // In case the sources are the same, there's a need to refresh the style
      setTimeout(() => {
        inspect.current!.render();
      }, 500);
    }
  });

  geocoder.current?.setPlaceholder(t("Search"));
  zoomControl.current?.setLabel(t("Zoom:"));
  return <div
    className="maputnik-map__map"
    role="region"
    aria-label={t("Map view")}
    ref={container}
    data-wd-key="maplibre:map"
  ></div>;
};

export const MapMaplibreGl = withTranslation()(React.memo(MapMaplibreGlInternal, arePropsEqual));
