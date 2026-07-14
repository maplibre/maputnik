import {useCallback, useEffect, useRef, useState} from "react";
import cloneDeep from "lodash.clonedeep";
import clamp from "lodash.clamp";
import buffer from "buffer";
import get from "lodash.get";
import {unset} from "lodash";
import {arrayMoveMutable} from "array-move";
import hash from "string-hash";
import { PMTiles } from "pmtiles";
import {type Map, type LayerSpecification, type StyleSpecification, type ValidationError, type SourceSpecification} from "maplibre-gl";
import {validateStyleMin} from "@maplibre/maplibre-gl-style-spec";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";

import { MapMaplibreGl } from "./MapMaplibreGl";
import { MapOpenLayers } from "./MapOpenLayers";
import { CodeEditor } from "./CodeEditor";
import { LayerList } from "./LayerList";
import { LayerEditor } from "./LayerEditor";
import { AppToolbar, type MapState } from "./AppToolbar";
import { AppLayout } from "./AppLayout";
import { AppMessagePanel as MessagePanel } from "./AppMessagePanel";

import { ModalSettings } from "./modals/ModalSettings";
import { ModalExport } from "./modals/ModalExport";
import { ModalSources } from "./modals/ModalSources";
import { ModalOpen } from "./modals/ModalOpen";
import { ModalShortcuts } from "./modals/ModalShortcuts";
import { ModalDebug } from "./modals/ModalDebug";
import { ModalGlobalState } from "./modals/ModalGlobalState";

import {downloadGlyphsMetadata, downloadSpriteMetadata} from "../libs/metadata";
import { emptyStyle, getAccessToken, replaceAccessTokens } from "../libs/style";
import { undoMessages, redoMessages } from "../libs/diffmessage";
import { createStyleStore, type IStyleStore } from "../libs/store/style-store-factory";
import { RevisionStore } from "../libs/revisions";
import { LayerWatcher } from "../libs/layerwatcher";
import tokens from "../config/tokens.json";
import isEqual from "lodash.isequal";
import { type MapOptions } from "maplibre-gl";
import { type MappedError, type OnStyleChangedOpts, type StyleSpecificationWithId } from "../libs/definitions";

// Buffer must be defined globally for @maplibre/maplibre-gl-style-spec validate() function to succeed.
window.Buffer = buffer.Buffer;

function setFetchAccessToken(url: string, mapStyle: StyleSpecification) {
  const matchesTilehosting = url.match(/\.tilehosting\.com/);
  const matchesMaptiler = url.match(/\.maptiler\.com/);
  const matchesThunderforest = url.match(/\.thunderforest\.com/);
  const matchesLocationIQ = url.match(/\.locationiq\.com/);
  if (matchesTilehosting || matchesMaptiler) {
    const accessToken = getAccessToken("openmaptiles", mapStyle, {allowFallback: true});
    if (accessToken) {
      return url.replace("{key}", accessToken);
    }
  }
  else if (matchesThunderforest) {
    const accessToken = getAccessToken("thunderforest", mapStyle, {allowFallback: true});
    if (accessToken) {
      return url.replace("{key}", accessToken);
    }
  }
  else if (matchesLocationIQ) {
    const accessToken = getAccessToken("locationiq", mapStyle, {allowFallback: true});
    if (accessToken) {
      return url.replace("{key}", accessToken);
    }
  }
  else {
    return url;
  }
}

function updateRootSpec(spec: any, fieldName: string, newValues: any) {
  return {
    ...spec,
    $root: {
      ...spec.$root,
      [fieldName]: {
        ...spec.$root[fieldName],
        values: newValues
      }
    }
  };
}

type AppState = {
  errors: MappedError[],
  infos: string[],
  mapStyle: StyleSpecificationWithId,
  dirtyMapStyle?: StyleSpecification,
  selectedLayerIndex: number,
  selectedLayerOriginalId?: string,
  sources: {[key: string]: SourceSpecification & {layers: string[]} },
  vectorLayers: {},
  spec: any,
  mapView: {
    zoom: number,
    center: {
      lng: number,
      lat: number,
    },
    _from: "map" | "app"
  },
  maplibreGlDebugOptions: Partial<MapOptions> & {
    showTileBoundaries: boolean,
    showCollisionBoxes: boolean,
    showOverdrawInspector: boolean,
  },
  openlayersDebugOptions: {
    debugToolbox: boolean,
  },
  mapState: MapState
  isOpen: {
    settings: boolean
    sources: boolean
    open: boolean
    shortcuts: boolean
    export: boolean
    debug: boolean
    globalState: boolean
    codeEditor: boolean
  }
  fileHandle: FileSystemFileHandle | null
};

export function App() {
  const [state, setStateRaw] = useState<AppState>(() => ({
    errors: [],
    infos: [],
    mapStyle: emptyStyle,
    selectedLayerIndex: 0,
    sources: {},
    vectorLayers: {},
    mapState: "map",
    spec: latest,
    mapView: {
      zoom: 0,
      center: {
        lng: 0,
        lat: 0,
      },
      _from: "app"
    },
    isOpen: {
      settings: false,
      sources: false,
      open: false,
      shortcuts: false,
      export: false,
      debug: false,
      globalState: false,
      codeEditor: false
    },
    maplibreGlDebugOptions: {
      showTileBoundaries: false,
      showCollisionBoxes: false,
      showOverdrawInspector: false,
    },
    openlayersDebugOptions: {
      debugToolbox: false,
    },
    fileHandle: null,
  }));

  // `this.state` in a class component is always the latest committed state, even when
  // read from an async function or a long lived callback. A closure over `state` would
  // capture the state of the render it was created in. `stateRef` restores the class
  // semantics: read `state` in render, read `stateRef.current` everywhere else.
  const stateRef = useRef(state);
  stateRef.current = state;

  // Emulates `this.setState(partial, callback)`: a shallow merge plus an optional
  // completion callback that runs once the update has been committed.
  const pendingCallbacks = useRef<Array<() => void>>([]);
  const setState = useCallback((partial: Partial<AppState>, cb?: () => void) => {
    if (cb) pendingCallbacks.current.push(cb);
    setStateRaw(prev => ({ ...prev, ...partial }));
  }, []);

  // No dependency array on purpose: this must run after *every* commit, exactly like
  // the completion callback of `this.setState`.
  useEffect(() => {
    if (pendingCallbacks.current.length === 0) return;
    const cbs = pendingCallbacks.current;
    pendingCallbacks.current = [];
    cbs.forEach(cb => cb());
  });

  // Non-state instance fields of the class, they must not trigger a re-render.
  const revisionStore = useRef<RevisionStore>(null!);
  if (!revisionStore.current) {
    revisionStore.current = new RevisionStore();
  }

  const styleStore = useRef<IStyleStore | null>(null);

  const layerWatcher = useRef<LayerWatcher>(null!);
  if (!layerWatcher.current) {
    layerWatcher.current = new LayerWatcher({
      onVectorLayersChange: v => setState({ vectorLayers: v })
    });
  }

  const saveStyle = useCallback((snapshotStyle: StyleSpecificationWithId) => {
    styleStore.current?.save(snapshotStyle);
  }, []);

  const updateFonts = useCallback((urlTemplate: string) => {
    const metadata: {[key: string]: string} = stateRef.current.mapStyle.metadata || {} as any;
    const accessToken = metadata["maputnik:openmaptiles_access_token"] || tokens.openmaptiles;

    const glyphUrl = (typeof urlTemplate === "string")? urlTemplate.replace("{key}", accessToken): urlTemplate;
    downloadGlyphsMetadata(glyphUrl).then(fonts => {
      setState({ spec: updateRootSpec(stateRef.current.spec, "glyphs", fonts)});
    });
  }, [setState]);

  const updateIcons = useCallback((baseUrl: string) => {
    downloadSpriteMetadata(baseUrl).then(icons => {
      setState({ spec: updateRootSpec(stateRef.current.spec, "sprite", icons)});
    });
  }, [setState]);

  const setStateInUrl = useCallback(() => {
    const {mapState, mapStyle, isOpen} = stateRef.current;
    const {selectedLayerIndex} = stateRef.current;
    const url = new URL(location.href);
    const hashVal = hash(JSON.stringify(mapStyle));
    url.searchParams.set("layer", `${hashVal}~${selectedLayerIndex}`);

    const openModals = Object.entries(isOpen)
      .map(([key, val]) => (val === true ? key : null))
      .filter(val => val !== null);

    if (openModals.length > 0) {
      url.searchParams.set("modal", openModals.join(","));
    }
    else {
      url.searchParams.delete("modal");
    }

    if (mapState === "map") {
      url.searchParams.delete("view");
    }
    else if (mapState === "inspect") {
      url.searchParams.set("view", "inspect");
    }

    history.replaceState({selectedLayerIndex}, "Maputnik", url.href);
  }, []);

  const fetchSources = useCallback(async () => {
    const sourceList: {[key: string]: SourceSpecification & {layers: string[]}} = {};
    for(const key of Object.keys(stateRef.current.mapStyle.sources)) {
      const source = stateRef.current.mapStyle.sources[key];
      if(source.type !== "vector" || !("url" in source)) {
        sourceList[key] = stateRef.current.sources[key] || {...stateRef.current.mapStyle.sources[key]};
        if (sourceList[key].layers === undefined) {
          sourceList[key].layers = [];
        }
      } else {
        sourceList[key] = {
          type: source.type,
          layers: []
        };

        let url = source.url;

        try {
          url = setFetchAccessToken(url!, stateRef.current.mapStyle);
        } catch(err) {
          console.warn("Failed to setFetchAccessToken: ", err);
        }

        const setVectorLayers = (json:any) => {
          if(!Object.prototype.hasOwnProperty.call(json, "vector_layers")) {
            return;
          }

          for(const layer of json.vector_layers) {
            sourceList[key].layers.push(layer.id);
          }
        };

        try {
          if (url!.startsWith("pmtiles://")) {
            const json = await (new PMTiles(url!.substring(10))).getTileJson("");
            setVectorLayers(json);
          } else {
            const response = await fetch(url!, { mode: "cors" });
            const json = await response.json();
            setVectorLayers(json);
          }
        } catch(err) {
          console.error(`Failed to process source for url: '${url}', ${err}`);
        }
      }
    }

    if(!isEqual(stateRef.current.sources, sourceList)) {
      console.debug("Setting sources", sourceList);
      setState({
        sources: sourceList
      });
    }
  }, [setState]);

  const setMapState = useCallback((newState: MapState) => {
    setState({
      mapState: newState
    }, setStateInUrl);
  }, [setState, setStateInUrl]);

  const setModal = useCallback((modalName: keyof AppState["isOpen"], value: boolean) => {
    setState({
      isOpen: {
        ...stateRef.current.isOpen,
        [modalName]: value
      }
    }, setStateInUrl);
  }, [setState, setStateInUrl]);

  const toggleModal = useCallback((modalName: keyof AppState["isOpen"]) => {
    setModal(modalName, !stateRef.current.isOpen[modalName]);
  }, [setModal]);

  const getInitialStateFromUrl = useCallback((mapStyle: StyleSpecification) => {
    const url = new URL(location.href);
    const modalParam = url.searchParams.get("modal");

    if (modalParam && modalParam !== "") {
      const modals = modalParam.split(",");
      const modalObj: {[key: string]: boolean} = {};
      modals.forEach(modalName => {
        modalObj[modalName] = true;
      });

      setState({
        isOpen: {
          ...stateRef.current.isOpen,
          ...modalObj,
        }
      });
    }

    const view = url.searchParams.get("view");
    if (view && view !== "") {
      setMapState(view as MapState);
    }

    const path = url.searchParams.get("layer");
    if (path) {
      try {
        const parts = path.split("~");
        const [hashVal, selectedLayerIndex] = [
          parts[0],
          parseInt(parts[1], 10),
        ];

        let valid = true;
        if (hashVal !== "-") {
          const currentHashVal = hash(JSON.stringify(mapStyle));
          if (currentHashVal !== parseInt(hashVal, 10)) {
            valid = false;
          }
        }
        if (valid) {
          setState({
            selectedLayerIndex,
            selectedLayerOriginalId: mapStyle.layers[selectedLayerIndex].id,
          });
        }
      }
      catch (err) {
        console.warn(err);
      }
    }
  }, [setState, setMapState]);

  const onStyleChanged = useCallback((newStyle: StyleSpecificationWithId, opts: OnStyleChangedOpts={}): void => {
    opts = {
      save: true,
      addRevision: true,
      initialLoad: false,
      ...opts,
    };


    // Detect empty style
    const oldStyle = stateRef.current.mapStyle;
    const isEmptySources = !oldStyle.sources || Object.keys(oldStyle.sources).length === 0;
    const isEmptyLayers = !oldStyle.layers || oldStyle.layers.length === 0;
    const isEmptyStyle = isEmptySources && isEmptyLayers;

    // For the style object, find the urls that has "{key}" and insert the correct API keys
    // Without this, going from e.g. MapTiler to OpenLayers and back will lose the maptlier key.

    if (newStyle.glyphs && typeof newStyle.glyphs === "string") {
      newStyle.glyphs = setFetchAccessToken(newStyle.glyphs, newStyle);
    }

    if (newStyle.sprite && typeof newStyle.sprite === "string") {
      newStyle.sprite = setFetchAccessToken(newStyle.sprite, newStyle);
    }

    for (const [_sourceId, source] of Object.entries(newStyle.sources)) {
      if (source && "url" in source && typeof source.url === "string") {
        source.url = setFetchAccessToken(source.url, newStyle);
      }
    }


    if (opts.initialLoad) {
      getInitialStateFromUrl(newStyle);
    }

    const errors: ValidationError[] = validateStyleMin(newStyle) || [];
    // The validate function doesn't give us errors for duplicate error with
    // empty string for layer.id, manually deal with that here.
    const layerErrors: (Error | ValidationError)[] = [];
    if (newStyle && newStyle.layers) {
      const foundLayers = new global.Map();
      newStyle.layers.forEach((layer, index) => {
        if (layer.id === "" && foundLayers.has(layer.id)) {
          const error = new Error(
            `layers[${index}]: duplicate layer id [empty_string], previously used`
          );
          layerErrors.push(error);
        }
        foundLayers.set(layer.id, true);
      });
    }

    const mappedErrors: MappedError[] = layerErrors.concat(errors).map(error => {
      // Special case: Duplicate layer id
      const dupMatch = error.message.match(/layers\[(\d+)\]: (duplicate layer id "?(.*)"?, previously used)/);
      if (dupMatch) {
        const [, index, message] = dupMatch;
        return {
          message: error.message,
          parsed: {
            type: "layer",
            data: {
              index: parseInt(index, 10),
              key: "id",
              message,
            }
          }
        };
      }

      // Special case: Invalid source
      const invalidSourceMatch = error.message.match(/layers\[(\d+)\]: (source "(?:.*)" not found)/);
      if (invalidSourceMatch) {
        const [, index, message] = invalidSourceMatch;
        return {
          message: error.message,
          parsed: {
            type: "layer",
            data: {
              index: parseInt(index, 10),
              key: "source",
              message,
            }
          }
        };
      }

      const layerMatch = error.message.match(/layers\[(\d+)\]\.(?:(\S+)\.)?(\S+): (.*)/);
      if (layerMatch) {
        const [, index, group, property, message] = layerMatch;
        const key = (group && property) ? [group, property].join(".") : property;
        return {
          message: error.message,
          parsed: {
            type: "layer",
            data: {
              index: parseInt(index, 10),
              key,
              message
            }
          }
        };
      }
      else {
        return {
          message: error.message,
        };
      }
    });

    let dirtyMapStyle: StyleSpecification | undefined = undefined;
    if (errors.length > 0) {
      dirtyMapStyle = cloneDeep(newStyle);

      for (const error of errors) {
        const {message} = error;
        if (message) {
          try {
            const objPath = message.split(":")[0];
            // Errors can be deeply nested for example 'layers[0].filter[1][1][0]' we only care upto the property 'layers[0].filter'
            const unsetPath = objPath.match(/^\S+?\[\d+\]\.[^[]+/)![0];
            unset(dirtyMapStyle, unsetPath);
          }
          catch (err) {
            console.warn(message + " " + err);
          }
        }
      }
    }

    if(newStyle.glyphs !== stateRef.current.mapStyle.glyphs) {
      updateFonts(newStyle.glyphs as string);
    }
    if(newStyle.sprite !== stateRef.current.mapStyle.sprite) {
      updateIcons(newStyle.sprite as string);
    }

    if (opts.addRevision) {
      revisionStore.current.addRevision(newStyle);
    }
    if (opts.save) {
      saveStyle(newStyle);
    }

    const zoom = newStyle?.zoom;
    const center = newStyle?.center;

    setState({
      mapStyle: newStyle,
      dirtyMapStyle: dirtyMapStyle,
      mapView: isEmptyStyle && zoom && center ? {
        zoom: zoom,
        center: {
          lng: center[0],
          lat: center[1],
        },
        _from: "app"
      } : stateRef.current.mapView,
      errors: mappedErrors,
    }, () => {
      fetchSources();
      setStateInUrl();
    });
  }, [getInitialStateFromUrl, updateFonts, updateIcons, saveStyle, setState, fetchSources, setStateInUrl]);

  const onChangeMetadataProperty = useCallback((property: string, value: any) => {
    // If we're changing renderer reset the map state.
    if (
      property === "maputnik:renderer" &&
      value !== get(stateRef.current.mapStyle, ["metadata", "maputnik:renderer"], "mlgljs")
    ) {
      setState({
        mapState: "map"
      });
    }

    const changedStyle = {
      ...stateRef.current.mapStyle,
      metadata: {
        ...(stateRef.current.mapStyle as any).metadata,
        [property]: value
      }
    };

    onStyleChanged(changedStyle);
  }, [setState, onStyleChanged]);

  const onUndo = useCallback(() => {
    const activeStyle = revisionStore.current.undo();

    const messages = undoMessages(stateRef.current.mapStyle, activeStyle);
    onStyleChanged(activeStyle, {addRevision: false});
    setState({
      infos: messages,
    });
  }, [onStyleChanged, setState]);

  const onRedo = useCallback(() => {
    const activeStyle = revisionStore.current.redo();
    const messages = redoMessages(stateRef.current.mapStyle, activeStyle);
    onStyleChanged(activeStyle, {addRevision: false});
    setState({
      infos: messages,
    });
  }, [onStyleChanged, setState]);

  const onLayersChange = useCallback((changedLayers: LayerSpecification[]) => {
    const changedStyle = {
      ...stateRef.current.mapStyle,
      layers: changedLayers
    };
    onStyleChanged(changedStyle);
  }, [onStyleChanged]);

  const onMoveLayer = useCallback((move: {oldIndex: number; newIndex: number}) => {
    let { oldIndex, newIndex } = move;
    let layers = stateRef.current.mapStyle.layers;
    oldIndex = clamp(oldIndex, 0, layers.length-1);
    newIndex = clamp(newIndex, 0, layers.length-1);
    if(oldIndex === newIndex) return;

    if (oldIndex === stateRef.current.selectedLayerIndex) {
      setState({
        selectedLayerIndex: newIndex
      });
    }

    layers = layers.slice(0);
    arrayMoveMutable(layers, oldIndex, newIndex);
    onLayersChange(layers);
  }, [setState, onLayersChange]);

  const onLayerDestroy = useCallback((index: number) => {
    const layers = stateRef.current.mapStyle.layers;
    const remainingLayers = layers.slice(0);
    remainingLayers.splice(index, 1);
    onLayersChange(remainingLayers);
  }, [onLayersChange]);

  const onLayerCopy = useCallback((index: number) => {
    const layers = stateRef.current.mapStyle.layers;
    const changedLayers = layers.slice(0);

    const clonedLayer = cloneDeep(changedLayers[index]);
    clonedLayer.id = clonedLayer.id + "-copy";
    changedLayers.splice(index, 0, clonedLayer);
    onLayersChange(changedLayers);
  }, [onLayersChange]);

  const onLayerVisibilityToggle = useCallback((index: number) => {
    const layers = stateRef.current.mapStyle.layers;
    const changedLayers = layers.slice(0);

    const layer = { ...changedLayers[index] };
    const changedLayout = "layout" in layer ? {...layer.layout} : {};
    changedLayout.visibility = changedLayout.visibility === "none" ? "visible" : "none";

    layer.layout = changedLayout;
    changedLayers[index] = layer;
    onLayersChange(changedLayers);
  }, [onLayersChange]);


  const onLayerIdChange = useCallback((index: number, _oldId: string, newId: string) => {
    const changedLayers = stateRef.current.mapStyle.layers.slice(0);
    changedLayers[index] = {
      ...changedLayers[index],
      id: newId
    };

    onLayersChange(changedLayers);
  }, [onLayersChange]);

  const onLayerChanged = useCallback((index: number, layer: LayerSpecification) => {
    const changedLayers = stateRef.current.mapStyle.layers.slice(0);
    changedLayers[index] = layer;

    onLayersChange(changedLayers);
  }, [onLayersChange]);

  const setDefaultValues = useCallback((styleObj: StyleSpecificationWithId) => {
    const metadata: {[key: string]: string} = styleObj.metadata || {} as any;
    if(metadata["maputnik:renderer"] === undefined) {
      const changedStyle = {
        ...styleObj,
        metadata: {
          ...styleObj.metadata as any,
          "maputnik:renderer": "mlgljs"
        }
      };
      return changedStyle;
    } else {
      return styleObj;
    }
  }, []);

  const openStyle = useCallback((styleObj: StyleSpecificationWithId, fileHandle: FileSystemFileHandle | null) => {
    setState({fileHandle: fileHandle});
    styleObj = setDefaultValues(styleObj);
    onStyleChanged(styleObj);
  }, [setState, setDefaultValues, onStyleChanged]);

  const onMapChange = useCallback((mapView: {
    zoom: number,
    center: {
      lng: number,
      lat: number,
    },
    _from: "map" | "app"
  }) => {
    setState({
      mapView,
    });
  }, [setState]);

  const onLayerSelect = useCallback((index: number) => {
    setState({
      selectedLayerIndex: index,
      selectedLayerOriginalId: stateRef.current.mapStyle.layers[index].id,
    }, setStateInUrl);
  }, [setState, setStateInUrl]);

  const onSetFileHandle = useCallback((fileHandle: FileSystemFileHandle | null) => {
    setState({ fileHandle });
  }, [setState]);

  const onChangeOpenlayersDebug = useCallback((key: keyof AppState["openlayersDebugOptions"], value: boolean) => {
    setState({
      openlayersDebugOptions: {
        ...stateRef.current.openlayersDebugOptions,
        [key]: value,
      }
    });
  }, [setState]);

  const onChangeMaplibreGlDebug = useCallback((key: keyof AppState["maplibreGlDebugOptions"], value: any) => {
    setState({
      maplibreGlDebugOptions: {
        ...stateRef.current.maplibreGlDebugOptions,
        [key]: value,
      }
    });
  }, [setState]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if(navigator.platform.toUpperCase().indexOf("MAC") >= 0) {
      if(e.metaKey && e.shiftKey && e.keyCode === 90) {
        e.preventDefault();
        onRedo();
      }
      else if(e.metaKey && e.keyCode === 90) {
        e.preventDefault();
        onUndo();
      }
    }
    else {
      if(e.ctrlKey && e.keyCode === 90) {
        e.preventDefault();
        onUndo();
      }
      else if(e.ctrlKey && e.keyCode === 89) {
        e.preventDefault();
        onRedo();
      }
    }
  }, [onUndo, onRedo]);

  const configureKeyboardShortcuts = useCallback(() => {
    const shortcuts = [
      {
        key: "?",
        handler: () => {
          toggleModal("shortcuts");
        }
      },
      {
        key: "o",
        handler: () => {
          toggleModal("open");
        }
      },
      {
        key: "e",
        handler: () => {
          toggleModal("export");
        }
      },
      {
        key: "d",
        handler: () => {
          toggleModal("sources");
        }
      },
      {
        key: "s",
        handler: () => {
          toggleModal("settings");
        }
      },
      {
        key: "g",
        handler: () => {
          toggleModal("globalState");
        }
      },
      {
        key: "i",
        handler: () => {
          setMapState(
            stateRef.current.mapState === "map" ? "inspect" : "map"
          );
        }
      },
      {
        key: "m",
        handler: () => {
          (document.querySelector(".maplibregl-canvas") as HTMLCanvasElement).focus();
        }
      },
      {
        key: "!",
        handler: () => {
          toggleModal("debug");
        }
      },
    ];

    const onKeyUp = (e: KeyboardEvent) => {
      if(e.key === "Escape") {
        (e.target as HTMLElement).blur();
        document.body.focus();
      }
      else if(stateRef.current.isOpen.shortcuts || document.activeElement === document.body) {
        const shortcut = shortcuts.find((shortcut) => {
          return (shortcut.key === e.key);
        });

        if(shortcut) {
          setModal("shortcuts", false);
          shortcut.handler();
        }
      }
    };

    document.body.addEventListener("keyup", onKeyUp);

    return () => {
      document.body.removeEventListener("keyup", onKeyUp);
    };
  }, [toggleModal, setMapState, setModal]);

  // componentDidMount / componentWillUnmount. The class registered the keyup shortcut
  // listener from its constructor, here it moves into the mount effect so that the very
  // same handler reference can be removed again on unmount.
  useEffect(() => {
    const removeKeyboardShortcuts = configureKeyboardShortcuts();
    const keyPressHandler = handleKeyPress;
    window.addEventListener("keydown", keyPressHandler);

    const mount = async () => {
      styleStore.current = await createStyleStore((mapStyle, opts) => onStyleChanged(mapStyle, opts));
    };
    void mount();

    return () => {
      window.removeEventListener("keydown", keyPressHandler);
      removeKeyboardShortcuts();
    };
    // Every dependency below is a useCallback whose own dependencies are transitively
    // stable (they bottom out at `setState`, which has an empty dependency array, and at
    // refs). They therefore never change identity, so this effect runs exactly once on
    // mount and its cleanup runs exactly once on unmount, like componentDidMount /
    // componentWillUnmount.
  }, [configureKeyboardShortcuts, handleKeyPress, onStyleChanged]);

  const _getRenderer = () => {
    const metadata: {[key:string]: string} = state.mapStyle.metadata || {} as any;
    return metadata["maputnik:renderer"] || "mlgljs";
  };

  const mapRenderer = () => {
    const {mapStyle, dirtyMapStyle} = state;

    const mapProps = {
      mapStyle: (dirtyMapStyle || mapStyle),
      mapView: state.mapView,
      replaceAccessTokens: (mapStyle: StyleSpecification) => {
        return replaceAccessTokens(mapStyle, {
          allowFallback: true
        });
      },
      onDataChange: (e: {map: Map}) => {
        layerWatcher.current.analyzeMap(e.map);
        fetchSources();
      },
    };

    const renderer = _getRenderer();

    let mapElement;

    // Check if OL code has been loaded?
    if(renderer === "ol") {
      mapElement = <MapOpenLayers
        {...mapProps}
        onChange={onMapChange}
        debugToolbox={state.openlayersDebugOptions.debugToolbox}
        onLayerSelect={(layerId) => onLayerSelect(+layerId)}
      />;
    } else {

      mapElement = <MapMaplibreGl {...mapProps}
        onChange={onMapChange}
        options={state.maplibreGlDebugOptions}
        inspectModeEnabled={state.mapState === "inspect"}
        highlightedLayer={state.mapStyle.layers[state.selectedLayerIndex]}
        onLayerSelect={onLayerSelect} />;
    }

    let filterName;
    if(state.mapState.match(/^filter-/)) {
      filterName = state.mapState.replace(/^filter-/, "");
    }
    const elementStyle: {filter?: string} = {};
    if (filterName) {
      elementStyle.filter = `url('#${filterName}')`;
    }

    return <div style={elementStyle} className="maputnik-map__container" data-wd-key="maplibre:container">
      {mapElement}
    </div>;
  };

  const layers = state.mapStyle.layers || [];
  const selectedLayer = layers.length > 0 ? layers[state.selectedLayerIndex] : undefined;

  const toolbar = <AppToolbar
    renderer={_getRenderer()}
    mapState={state.mapState}
    mapStyle={state.mapStyle}
    inspectModeEnabled={state.mapState === "inspect"}
    sources={state.sources}
    onStyleChanged={onStyleChanged}
    onStyleOpen={onStyleChanged}
    onSetMapState={setMapState}
    onToggleModal={(modal: keyof AppState["isOpen"]) => toggleModal(modal)}
  />;

  const codeEditor = state.isOpen.codeEditor ? <CodeEditor
    value={state.mapStyle}
    onChange={(style) => onStyleChanged(style)}
    onClose={() => setModal("codeEditor", false)}
  /> : undefined;

  const layerList = <LayerList
    onMoveLayer={onMoveLayer}
    onLayerDestroy={onLayerDestroy}
    onLayerCopy={onLayerCopy}
    onLayerVisibilityToggle={onLayerVisibilityToggle}
    onLayersChange={onLayersChange}
    onLayerSelect={onLayerSelect}
    selectedLayerIndex={state.selectedLayerIndex}
    layers={layers}
    sources={state.sources}
    errors={state.errors}
  />;

  const layerEditor = selectedLayer ? <LayerEditor
    key={state.selectedLayerOriginalId}
    layer={selectedLayer}
    layerIndex={state.selectedLayerIndex}
    isFirstLayer={state.selectedLayerIndex < 1}
    isLastLayer={state.selectedLayerIndex === state.mapStyle.layers.length-1}
    sources={state.sources}
    vectorLayers={state.vectorLayers}
    spec={state.spec}
    onMoveLayer={onMoveLayer}
    onLayerChanged={onLayerChanged}
    onLayerDestroy={onLayerDestroy}
    onLayerCopy={onLayerCopy}
    onLayerVisibilityToggle={onLayerVisibilityToggle}
    onLayerIdChange={onLayerIdChange}
    errors={state.errors}
  /> : undefined;

  const bottomPanel = (state.errors.length + state.infos.length) > 0 ? <MessagePanel
    currentLayer={selectedLayer}
    selectedLayerIndex={state.selectedLayerIndex}
    onLayerSelect={onLayerSelect}
    mapStyle={state.mapStyle}
    errors={state.errors}
    infos={state.infos}
  /> : undefined;


  const modals = <div>
    <ModalDebug
      renderer={_getRenderer()}
      maplibreGlDebugOptions={state.maplibreGlDebugOptions}
      openlayersDebugOptions={state.openlayersDebugOptions}
      onChangeMaplibreGlDebug={onChangeMaplibreGlDebug}
      onChangeOpenlayersDebug={onChangeOpenlayersDebug}
      isOpen={state.isOpen.debug}
      onOpenToggle={() => toggleModal("debug")}
      mapView={state.mapView}
    />
    <ModalShortcuts
      isOpen={state.isOpen.shortcuts}
      onOpenToggle={() => toggleModal("shortcuts")}
    />
    <ModalSettings
      mapStyle={state.mapStyle}
      onStyleChanged={onStyleChanged}
      onChangeMetadataProperty={onChangeMetadataProperty}
      isOpen={state.isOpen.settings}
      onOpenToggle={() => toggleModal("settings")}
    />
    <ModalExport
      mapStyle={state.mapStyle}
      onStyleChanged={onStyleChanged}
      isOpen={state.isOpen.export}
      onOpenToggle={() => toggleModal("export")}
      fileHandle={state.fileHandle}
      onSetFileHandle={onSetFileHandle}
    />
    <ModalOpen
      isOpen={state.isOpen.open}
      onStyleOpen={openStyle}
      onOpenToggle={() => toggleModal("open")}
      fileHandle={state.fileHandle}
    />
    <ModalSources
      mapStyle={state.mapStyle}
      onStyleChanged={onStyleChanged}
      isOpen={state.isOpen.sources}
      onOpenToggle={() => toggleModal("sources")}
    />
    <ModalGlobalState
      mapStyle={state.mapStyle}
      onStyleChanged={onStyleChanged}
      isOpen={state.isOpen.globalState}
      onOpenToggle={() => toggleModal("globalState")}
    />
  </div>;

  return <AppLayout
    toolbar={toolbar}
    layerList={layerList}
    layerEditor={layerEditor}
    codeEditor={codeEditor}
    map={mapRenderer()}
    bottom={bottomPanel}
    modals={modals}
  />;
}
