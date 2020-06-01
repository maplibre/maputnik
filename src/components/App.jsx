import autoBind from 'react-autobind';
import React from 'react'
import cloneDeep from 'lodash.clonedeep'
import clamp from 'lodash.clamp'
import get from 'lodash.get'
import {unset} from 'lodash'
import arrayMove from 'array-move'
import url from 'url'

import MapMapboxGl from './MapMapboxGl'
import MapOpenLayers from './MapOpenLayers'
import LayerList from './LayerList'
import LayerEditor from './LayerEditor'
import AppToolbar from './AppToolbar'
import AppLayout from './AppLayout'
import MessagePanel from './AppMessagePanel'

import ModalSettings from './ModalSettings'
import ModalExport from './ModalExport'
import ModalSources from './ModalSources'
import ModalOpen from './ModalOpen'
import ModalShortcuts from './ModalShortcuts'
import ModalSurvey from './ModalSurvey'
import ModalDebug from './ModalDebug'

import { downloadGlyphsMetadata, downloadSpriteMetadata } from '../libs/metadata'
import {latest, validate} from '@mapbox/mapbox-gl-style-spec'
import style from '../libs/style'
import { initialStyleUrl, loadStyleUrl, removeStyleQuerystring } from '../libs/urlopen'
import { undoMessages, redoMessages } from '../libs/diffmessage'
import { StyleStore } from '../libs/stylestore'
import { ApiStyleStore } from '../libs/apistore'
import { RevisionStore } from '../libs/revisions'
import LayerWatcher from '../libs/layerwatcher'
import tokens from '../config/tokens.json'
import isEqual from 'lodash.isequal'
import Debug from '../libs/debug'
import queryUtil from '../libs/query-util'
import {formatLayerId} from '../util/format';

import MapboxGl from 'mapbox-gl'


// Similar functionality as <https://github.com/mapbox/mapbox-gl-js/blob/7e30aadf5177486c2cfa14fe1790c60e217b5e56/src/util/mapbox.js>
function normalizeSourceURL (url, apiToken="") {
  const matches = url.match(/^mapbox:\/\/(.*)/);
  if (matches) {
    // mapbox://mapbox.mapbox-streets-v7
    return `https://api.mapbox.com/v4/${matches[1]}.json?secure&access_token=${apiToken}`
  }
  else {
    return url;
  }
}

function setFetchAccessToken(url, mapStyle) {
  const matchesTilehosting = url.match(/\.tilehosting\.com/);
  const matchesMaptiler = url.match(/\.maptiler\.com/);
  const matchesThunderforest = url.match(/\.thunderforest\.com/);
  if (matchesTilehosting || matchesMaptiler) {
    const accessToken = style.getAccessToken("openmaptiles", mapStyle, {allowFallback: true})
    if (accessToken) {
      return url.replace('{key}', accessToken)
    }
  }
  else if (matchesThunderforest) {
    const accessToken = style.getAccessToken("thunderforest", mapStyle, {allowFallback: true})
    if (accessToken) {
      return url.replace('{key}', accessToken)
    }
  }
  else {
    return url;
  }
}

function updateRootSpec(spec, fieldName, newValues) {
  return {
    ...spec,
    $root: {
      ...spec.$root,
      [fieldName]: {
        ...spec.$root[fieldName],
        values: newValues
      }
    }
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this);

    this.revisionStore = new RevisionStore()
    const params = new URLSearchParams(window.location.search.substring(1))
    let port = params.get("localport")
    if (port == null && (window.location.port != 80 && window.location.port != 443)) {
      port = window.location.port
    }
    this.styleStore = new ApiStyleStore({
      onLocalStyleChange: mapStyle => this.onStyleChanged(mapStyle, {save: false}),
      port: port,
      host: params.get("localhost")
    })


    const shortcuts = [
      {
        key: "?",
        handler: () => {
          this.toggleModal("shortcuts");
        }
      },
      {
        key: "o",
        handler: () => {
          this.toggleModal("open");
        }
      },
      {
        key: "e",
        handler: () => {
          this.toggleModal("export");
        }
      },
      {
        key: "d",
        handler: () => {
          this.toggleModal("sources");
        }
      },
      {
        key: "s",
        handler: () => {
          this.toggleModal("settings");
        }
      },
      {
        key: "i",
        handler: () => {
          this.setMapState(
            this.state.mapState === "map" ? "inspect" : "map"
          );
        }
      },
      {
        key: "m",
        handler: () => {
          document.querySelector(".mapboxgl-canvas").focus();
        }
      },
      {
        key: "!",
        handler: () => {
          this.toggleModal("debug");
        }
      },
    ]

    document.body.addEventListener("keyup", (e) => {
      if(e.key === "Escape") {
        e.target.blur();
        document.body.focus();
      }
      else if(this.state.isOpen.shortcuts || document.activeElement === document.body) {
        const shortcut = shortcuts.find((shortcut) => {
          return (shortcut.key === e.key)
        })

        if(shortcut) {
          this.setModal("shortcuts", false);
          shortcut.handler(e);
        }
      }
    })

    const styleUrl = initialStyleUrl()
    if(styleUrl && window.confirm("Load style from URL: " + styleUrl + " and discard current changes?")) {
      this.styleStore = new StyleStore()
      loadStyleUrl(styleUrl, mapStyle => this.onStyleChanged(mapStyle))
      removeStyleQuerystring()
    } else {
      if(styleUrl) {
        removeStyleQuerystring()
      }
      this.styleStore.init(err => {
        if(err) {
          console.log('Falling back to local storage for storing styles')
          this.styleStore = new StyleStore()
        }
        this.styleStore.latestStyle(mapStyle => this.onStyleChanged(mapStyle))

        if(Debug.enabled()) {
          Debug.set("maputnik", "styleStore", this.styleStore);
          Debug.set("maputnik", "revisionStore", this.revisionStore);
        }
      })
    }

    if(Debug.enabled()) {
      Debug.set("maputnik", "revisionStore", this.revisionStore);
      Debug.set("maputnik", "styleStore", this.styleStore);
    }

    const queryObj = url.parse(window.location.href, true).query;

    this.state = {
      errors: [],
      infos: [],
      mapStyle: style.emptyStyle,
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
      },
      isOpen: {
        settings: false,
        sources: false,
        open: false,
        shortcuts: false,
        export: false,
        // TODO: Disabled for now, this should be opened on the Nth visit to the editor
        survey: false,
        debug: false,
      },
      mapboxGlDebugOptions: {
        showTileBoundaries: false,
        showCollisionBoxes: false,
        showOverdrawInspector: false,
      },
      openlayersDebugOptions: {
        debugToolbox: false,
      },
    }

    this.layerWatcher = new LayerWatcher({
      onVectorLayersChange: v => this.setState({ vectorLayers: v })
    })
  }

  handleKeyPress = (e) => {
    if(navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
      if(e.metaKey && e.shiftKey && e.keyCode === 90) {
        e.preventDefault();
        this.onRedo(e);
      }
      else if(e.metaKey && e.keyCode === 90) {
        e.preventDefault();
        this.onUndo(e);
      }
    }
    else {
      if(e.ctrlKey && e.keyCode === 90) {
        e.preventDefault();
        this.onUndo(e);
      }
      else if(e.ctrlKey && e.keyCode === 89) {
        e.preventDefault();
        this.onRedo(e);
      }
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  saveStyle(snapshotStyle) {
    this.styleStore.save(snapshotStyle)
  }

  updateFonts(urlTemplate) {
    const metadata = this.state.mapStyle.metadata || {}
    const accessToken = metadata['maputnik:openmaptiles_access_token'] || tokens.openmaptiles

    let glyphUrl = (typeof urlTemplate === 'string')? urlTemplate.replace('{key}', accessToken): urlTemplate;
    downloadGlyphsMetadata(glyphUrl, fonts => {
      this.setState({ spec: updateRootSpec(this.state.spec, 'glyphs', fonts)})
    })
  }

  updateIcons(baseUrl) {
    downloadSpriteMetadata(baseUrl, icons => {
      this.setState({ spec: updateRootSpec(this.state.spec, 'sprite', icons)})
    })
  }

  onChangeMetadataProperty = (property, value) => {
    // If we're changing renderer reset the map state.
    if (
      property === 'maputnik:renderer' &&
      value !== get(this.state.mapStyle, ['metadata', 'maputnik:renderer'], 'mbgljs')
    ) {
      this.setState({
        mapState: 'map'
      });
    }

    const changedStyle = {
      ...this.state.mapStyle,
      metadata: {
        ...this.state.mapStyle.metadata,
        [property]: value
      }
    }
    this.onStyleChanged(changedStyle)
  }

  onStyleChanged = (newStyle, opts={}) => {
    opts = {
      save: true,
      addRevision: true,
      ...opts,
    };

    const errors = validate(newStyle, latest) || [];

    // The validate function doesn't give us errors for duplicate error with
    // empty string for layer.id, manually deal with that here.
    const layerErrors = [];
    if (newStyle && newStyle.layers) {
      const foundLayers = new Map();
      newStyle.layers.forEach((layer, index) => {
        if (layer.id === "" && foundLayers.has(layer.id)) {
          const message = `Duplicate layer: ${formatLayerId(layer.id)}`;
          const error = new Error(
            `layers[${index}]: duplicate layer id [empty_string], previously used`
          );
          layerErrors.push(error);
        }
        foundLayers.set(layer.id, true);
      });
    }

    const mappedErrors = layerErrors.concat(errors).map(error => {
      // Special case: Duplicate layer id
      const dupMatch = error.message.match(/layers\[(\d+)\]: (duplicate layer id "?(.*)"?, previously used)/);
      if (dupMatch) {
        const [matchStr, index, message] = dupMatch;
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
        }
      }

      // Special case: Invalid source
      const invalidSourceMatch = error.message.match(/layers\[(\d+)\]: (source "(?:.*)" not found)/);
      if (invalidSourceMatch) {
        const [matchStr, index, message] = invalidSourceMatch;
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
        }
      }

      const layerMatch = error.message.match(/layers\[(\d+)\]\.(?:(\S+)\.)?(\S+): (.*)/);
      if (layerMatch) {
        const [matchStr, index, group, property, message] = layerMatch;
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
        }
      }
      else {
        return {
          message: error.message,
        };
      }
    });

    let dirtyMapStyle = undefined;
    if (errors.length > 0) {
      dirtyMapStyle = cloneDeep(newStyle);

      errors.forEach(error => {
        const {message} = error;
        if (message) {
          try {
            const objPath = message.split(":")[0];
            // Errors can be deply nested for example 'layers[0].filter[1][1][0]' we only care upto the property 'layers[0].filter'
            const unsetPath = objPath.match(/^\S+?\[\d+\]\.[^\[]+/)[0];
            unset(dirtyMapStyle, unsetPath);
          }
          catch (err) {
            console.warn(err);
          }
        }
      });
    }

    if(newStyle.glyphs !== this.state.mapStyle.glyphs) {
      this.updateFonts(newStyle.glyphs)
    }
    if(newStyle.sprite !== this.state.mapStyle.sprite) {
      this.updateIcons(newStyle.sprite)
    }

    if (opts.addRevision) {
      this.revisionStore.addRevision(newStyle);
    }
    if (opts.save) {
      this.saveStyle(newStyle);
    }
       
    this.setState({
      mapStyle: newStyle,
      dirtyMapStyle: dirtyMapStyle,
      errors: mappedErrors,
    }, () => {
      this.fetchSources();
    })

  }

  onUndo = () => {
    const activeStyle = this.revisionStore.undo()

    const messages = undoMessages(this.state.mapStyle, activeStyle)
    this.onStyleChanged(activeStyle, {addRevision: false});
    this.setState({
      infos: messages,
    })
  }

  onRedo = () => {
    const activeStyle = this.revisionStore.redo()
    const messages = redoMessages(this.state.mapStyle, activeStyle)
    this.onStyleChanged(activeStyle, {addRevision: false});
    this.setState({
      infos: messages,
    })
  }

  onMoveLayer = (move) => {
    let { oldIndex, newIndex } = move;
    let layers = this.state.mapStyle.layers;
    oldIndex = clamp(oldIndex, 0, layers.length-1);
    newIndex = clamp(newIndex, 0, layers.length-1);
    if(oldIndex === newIndex) return;

    if (oldIndex === this.state.selectedLayerIndex) {
      this.setState({
        selectedLayerIndex: newIndex
      });
    }

    layers = layers.slice(0);
    layers = arrayMove(layers, oldIndex, newIndex);
    this.onLayersChange(layers);
  }

  onLayersChange = (changedLayers) => {
    const changedStyle = {
      ...this.state.mapStyle,
      layers: changedLayers
    }
    this.onStyleChanged(changedStyle)
  }

  onLayerDestroy = (index) => {
    let layers = this.state.mapStyle.layers;
    const remainingLayers = layers.slice(0);
    remainingLayers.splice(index, 1);
    this.onLayersChange(remainingLayers);
  }

  onLayerCopy = (index) => {
    let layers = this.state.mapStyle.layers;
    const changedLayers = layers.slice(0)

    const clonedLayer = cloneDeep(changedLayers[index])
    clonedLayer.id = clonedLayer.id + "-copy"
    changedLayers.splice(index, 0, clonedLayer)
    this.onLayersChange(changedLayers)
  }

  onLayerVisibilityToggle = (index) => {
    let layers = this.state.mapStyle.layers;
    const changedLayers = layers.slice(0)

    const layer = { ...changedLayers[index] }
    const changedLayout = 'layout' in layer ? {...layer.layout} : {}
    changedLayout.visibility = changedLayout.visibility === 'none' ? 'visible' : 'none'

    layer.layout = changedLayout
    changedLayers[index] = layer
    this.onLayersChange(changedLayers)
  }


  onLayerIdChange = (index, oldId, newId) => {
    const changedLayers = this.state.mapStyle.layers.slice(0)
    changedLayers[index] = {
      ...changedLayers[index],
      id: newId
    }

    this.onLayersChange(changedLayers)
  }

  onLayerChanged = (index, layer) => {
    const changedLayers = this.state.mapStyle.layers.slice(0)
    changedLayers[index] = layer

    this.onLayersChange(changedLayers)
  }

  setMapState = (newState) => {
    this.setState({
      mapState: newState
    })
  }

  setDefaultValues = (styleObj) => {
    const metadata = styleObj.metadata || {}
    if(metadata['maputnik:renderer'] === undefined) {
      const changedStyle = {
        ...styleObj,
        metadata: {
          ...styleObj.metadata,
          'maputnik:renderer': 'mbgljs'
        }
      }
      return changedStyle
    } else {
      return styleObj
    }
  }

  openStyle = (styleObj) => {
    styleObj = this.setDefaultValues(styleObj)
    this.onStyleChanged(styleObj)
  }

  fetchSources() {
    const sourceList = {};

    for(let [key, val] of Object.entries(this.state.mapStyle.sources)) {
      if(
        !this.state.sources.hasOwnProperty(key) &&
        val.type === "vector" &&
        val.hasOwnProperty("url")
      ) {
        sourceList[key] = {
          type: val.type,
          layers: []
        };

        let url = val.url;
        try {
          url = normalizeSourceURL(url, MapboxGl.accessToken);
        } catch(err) {
          console.warn("Failed to normalizeSourceURL: ", err);
        }

        try {
          url = setFetchAccessToken(url, this.state.mapStyle)
        } catch(err) {
          console.warn("Failed to setFetchAccessToken: ", err);
        }

        fetch(url, {
          mode: 'cors',
        })
        .then(response => response.json())
        .then(json => {

          if(!json.hasOwnProperty("vector_layers")) {
            return;
          }

          // Create new objects before setState
          const sources = Object.assign({}, {
            [key]: this.state.sources[key],
          });

          for(let layer of json.vector_layers) {
            sources[key].layers.push(layer.id)
          }

          console.debug("Updating source: "+key);
          this.setState({
            sources: sources
          });
        })
        .catch(err => {
          console.error("Failed to process sources for '%s'", url, err);
        });
      }
      else {
        sourceList[key] = this.state.sources[key] || this.state.mapStyle.sources[key];
      }
    }

    if(!isEqual(this.state.sources, sourceList)) {
      console.debug("Setting sources");
      this.setState({
        sources: sourceList
      })
    }
  }

  _getRenderer () {
    const metadata = this.state.mapStyle.metadata || {};
    return metadata['maputnik:renderer'] || 'mbgljs';
  }

  onMapChange = (mapView) => {
    this.setState({
      mapView,
    });
  }

  mapRenderer() {
    const {mapStyle, dirtyMapStyle} = this.state;
    const metadata = this.state.mapStyle.metadata || {};

    const mapProps = {
      mapStyle: (dirtyMapStyle || mapStyle),
      replaceAccessTokens: (mapStyle) => {
        return style.replaceAccessTokens(mapStyle, {
          allowFallback: true
        });
      },
      onDataChange: (e) => {
        this.layerWatcher.analyzeMap(e.map)
        this.fetchSources();
      },
    }

    const renderer = this._getRenderer();

    let mapElement;

    // Check if OL code has been loaded?
    if(renderer === 'ol') {
      mapElement = <MapOpenLayers
        {...mapProps}
        onChange={this.onMapChange}
        debugToolbox={this.state.openlayersDebugOptions.debugToolbox}
        onLayerSelect={this.onLayerSelect}
      />
    } else {
      mapElement = <MapMapboxGl {...mapProps}
        onChange={this.onMapChange}
        options={this.state.mapboxGlDebugOptions}
        inspectModeEnabled={this.state.mapState === "inspect"}
        highlightedLayer={this.state.mapStyle.layers[this.state.selectedLayerIndex]}
        onLayerSelect={this.onLayerSelect} />
    }

    let filterName;
    if(this.state.mapState.match(/^filter-/)) {
      filterName = this.state.mapState.replace(/^filter-/, "");
    }
    const elementStyle = {};
    if (filterName) {
      elementStyle.filter = `url('#${filterName}')`;
    };

    return <div style={elementStyle} className="maputnik-map__container">
      {mapElement}
    </div>
  }

  onLayerSelect = (index) => {
    this.setState({ selectedLayerIndex: index })
  }

  setModal(modalName, value) {
    if(modalName === 'survey' && value === false) {
      localStorage.setItem('survey', '');
    }

    this.setState({
      isOpen: {
        ...this.state.isOpen,
        [modalName]: value
      }
    })
  }

  toggleModal(modalName) {
    this.setModal(modalName, !this.state.isOpen[modalName]);
  }

  onChangeOpenlayersDebug = (key, value) => {
    this.setState({
      openlayersDebugOptions: {
        ...this.state.openlayersDebugOptions,
        [key]: value,
      }
    });
  }

  onChangeMaboxGlDebug = (key, value) => {
    this.setState({
      mapboxGlDebugOptions: {
        ...this.state.mapboxGlDebugOptions,
        [key]: value,
      }
    });
  }

  render() {
    const layers = this.state.mapStyle.layers || []
    const selectedLayer = layers.length > 0 ? layers[this.state.selectedLayerIndex] : null
    const metadata = this.state.mapStyle.metadata || {}

    const toolbar = <AppToolbar
      renderer={this._getRenderer()}
      mapState={this.state.mapState}
      mapStyle={this.state.mapStyle}
      inspectModeEnabled={this.state.mapState === "inspect"}
      sources={this.state.sources}
      onStyleChanged={this.onStyleChanged}
      onStyleOpen={this.onStyleChanged}
      onSetMapState={this.setMapState}
      onToggleModal={this.toggleModal.bind(this)}
    />

    const layerList = <LayerList
      onMoveLayer={this.onMoveLayer}
      onLayerDestroy={this.onLayerDestroy}
      onLayerCopy={this.onLayerCopy}
      onLayerVisibilityToggle={this.onLayerVisibilityToggle}
      onLayersChange={this.onLayersChange}
      onLayerSelect={this.onLayerSelect}
      selectedLayerIndex={this.state.selectedLayerIndex}
      layers={layers}
      sources={this.state.sources}
      errors={this.state.errors}
    />

    const layerEditor = selectedLayer ? <LayerEditor
      key={selectedLayer.id}
      layer={selectedLayer}
      layerIndex={this.state.selectedLayerIndex}
      isFirstLayer={this.state.selectedLayerIndex < 1}
      isLastLayer={this.state.selectedLayerIndex === this.state.mapStyle.layers.length-1}
      sources={this.state.sources}
      vectorLayers={this.state.vectorLayers}
      spec={this.state.spec}
      onMoveLayer={this.onMoveLayer}
      onLayerChanged={this.onLayerChanged}
      onLayerDestroy={this.onLayerDestroy}
      onLayerCopy={this.onLayerCopy}
      onLayerVisibilityToggle={this.onLayerVisibilityToggle}
      onLayerIdChange={this.onLayerIdChange}
      errors={this.state.errors}
    /> : null

    const bottomPanel = (this.state.errors.length + this.state.infos.length) > 0 ? <MessagePanel
      currentLayer={selectedLayer}
      selectedLayerIndex={this.state.selectedLayerIndex}
      onLayerSelect={this.onLayerSelect}
      mapStyle={this.state.mapStyle}
      errors={this.state.errors}
      infos={this.state.infos}
    /> : null


    const modals = <div>
      <ModalDebug
        renderer={this._getRenderer()}
        mapboxGlDebugOptions={this.state.mapboxGlDebugOptions}
        openlayersDebugOptions={this.state.openlayersDebugOptions}
        onChangeMaboxGlDebug={this.onChangeMaboxGlDebug}
        onChangeOpenlayersDebug={this.onChangeOpenlayersDebug}
        isOpen={this.state.isOpen.debug}
        onOpenToggle={this.toggleModal.bind(this, 'debug')}
        mapView={this.state.mapView}
      />
      <ModalShortcuts
        ref={(el) => this.shortcutEl = el}
        isOpen={this.state.isOpen.shortcuts}
        onOpenToggle={this.toggleModal.bind(this, 'shortcuts')}
      />
      <ModalSettings
        mapStyle={this.state.mapStyle}
        onStyleChanged={this.onStyleChanged}
        onChangeMetadataProperty={this.onChangeMetadataProperty}
        isOpen={this.state.isOpen.settings}
        onOpenToggle={this.toggleModal.bind(this, 'settings')}
        openlayersDebugOptions={this.state.openlayersDebugOptions}
      />
      <ModalExport
        mapStyle={this.state.mapStyle}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.export}
        onOpenToggle={this.toggleModal.bind(this, 'export')}
      />
      <ModalOpen
        isOpen={this.state.isOpen.open}
        onStyleOpen={this.openStyle}
        onOpenToggle={this.toggleModal.bind(this, 'open')}
      />
      <ModalSources
        mapStyle={this.state.mapStyle}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.sources}
        onOpenToggle={this.toggleModal.bind(this, 'sources')}
      />
      <ModalSurvey
        isOpen={this.state.isOpen.survey}
        onOpenToggle={this.toggleModal.bind(this, 'survey')}
      />
    </div>

    return <AppLayout
      toolbar={toolbar}
      layerList={layerList}
      layerEditor={layerEditor}
      map={this.mapRenderer()}
      bottom={bottomPanel}
      modals={modals}
    />
  }
}
