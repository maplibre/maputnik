import autoBind from 'react-autobind';
import React from 'react'
import cloneDeep from 'lodash.clonedeep'
import clamp from 'lodash.clamp'
import omit from 'lodash.omit'
import {arrayMove} from 'react-sortable-hoc'
import url from 'url'

import MapboxGlMap from './map/MapboxGlMap'
import OpenLayersMap from './map/OpenLayersMap'
import LayerList from './layers/LayerList'
import LayerEditor from './layers/LayerEditor'
import Toolbar from './Toolbar'
import AppLayout from './AppLayout'
import MessagePanel from './MessagePanel'

import SettingsModal from './modals/SettingsModal'
import ExportModal from './modals/ExportModal'
import SourcesModal from './modals/SourcesModal'
import OpenModal from './modals/OpenModal'
import ShortcutsModal from './modals/ShortcutsModal'
import SurveyModal from './modals/SurveyModal'

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

import IcepickStyle from 'icepick-style';
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

    // this.revisionStore = new RevisionStore()
    this.styleStore = new ApiStyleStore({
      onLocalStyleChange: mapStyle => this.onStyleChanged(mapStyle, false)
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

    const immutableStyle = new IcepickStyle();

    const styleUrl = initialStyleUrl()
    if(styleUrl && window.confirm("Load style from URL: " + styleUrl + " and discard current changes?")) {
      loadStyleUrl(styleUrl, mapStyle => this.onStyleChanged(mapStyle))
      removeStyleQuerystring()
    } else {
      if(styleUrl) {
        removeStyleQuerystring()
      }
      // this.styleStore.init(err => {
      //   if(err) {
      //     console.log('Falling back to local storage for storing styles')
      //     this.styleStore = new StyleStore()
      //   }
      //   this.styleStore.latestStyle(mapStyle => this.onStyleChanged(mapStyle))

      //   // if(Debug.enabled()) {
      //   //   Debug.set("maputnik", "styleStore", this.styleStore);
      //   //   Debug.set("maputnik", "revisionStore", this.revisionStore);
      //   // }
      // })
    }

    // if(Debug.enabled()) {
    //   Debug.set("maputnik", "revisionStore", this.revisionStore);
    //   Debug.set("maputnik", "styleStore", this.styleStore);
    // }

    const queryObj = url.parse(window.location.href, true).query;

    // HACK
    immutableStyle.on("change", () => {
      this.forceUpdate();
    })

    this.state = {
      errors: [],
      infos: [],
      mapStyle: immutableStyle,
      selectedLayerIndex: 0,
      sources: {},
      vectorLayers: {},
      mapState: "map",
      spec: latest,
      isOpen: {
        settings: false,
        sources: false,
        open: false,
        shortcuts: false,
        export: false,
        survey: localStorage.hasOwnProperty('survey') ? false : true
      },
      mapOptions: {
        showTileBoundaries: queryUtil.asBool(queryObj, "show-tile-boundaries"),
        showCollisionBoxes: queryUtil.asBool(queryObj, "show-collision-boxes"),
        showOverdrawInspector: queryUtil.asBool(queryObj, "show-overdraw-inspector")
      },
    }

    this.layerWatcher = new LayerWatcher({
      onVectorLayersChange: v => this.setState({ vectorLayers: v })
    })
  }

  handleKeyPress = (e) => {
    if(navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
      if(e.metaKey && e.shiftKey && e.keyCode === 90) {
        this.onRedo(e);
      }
      else if(e.metaKey && e.keyCode === 90) {
        this.onUndo(e);
      }
    }
    else {
      if(e.ctrlKey && e.keyCode === 90) {
        this.onUndo(e);
      }
      else if(e.ctrlKey && e.keyCode === 89) {
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

  onStyleChanged = (newStyle, save=true) => {
    this.state.mapStyle.replace(newStyle);
    // this.fetchSources();
  }

  onUndo = () => {
    if (this.state.mapStyle.canUndo()) {
      this.state.mapStyle.undo();
    }
  }

  onRedo = () => {
    if (this.state.mapStyle.canRedo()) {
      this.state.mapStyle.redo();
    }
  }

  onMoveLayer = (move) => {
    let { oldIndex, newIndex } = move;
    this.state.mapStyle.moveLayer(oldIndex, newIndex);
  }

  onAddLayer = (layer) => {
    this.state.mapStyle.addLayer(layer.id, layer);
  }

  onLayerDestroy = (layerId) => {
    this.state.mapStyle.removeLayer(layerId);
  }

  onLayerCopy = (layerId) => {
    const currentLayer = this.state.mapStyle.getLayerById(layerId);
    let layerIdx = this.state.mapStyle.current.layers.findIndex(layer => layer.id === layerId);

    let newId = currentLayer.id+"-copy";
    if (this.state.mapStyle.getLayerById(newId)) {
      let idx = 1;
      while (this.state.mapStyle.getLayerById(newId+idx)) {
        idx++;
      }
      newId = newId+idx;
    }
    this.state.mapStyle.addLayer(newId, currentLayer, layerIdx+1);
  }

  onLayerVisibilityToggle = (layerId) => {
    const currentLayer = this.state.mapStyle.getLayerById(layerId);

    let newLayer;
    if (currentLayer.layout && currentLayer.layout.visibility === 'none') {
      newLayer = {
        ...currentLayer,
        layout: omit(currentLayer.layout, 'visibility'),
      };
    }
    else {
      newLayer = {
        ...currentLayer,
        layout: {
          ...currentLayer.layout,
          visibility:  'none'
        }
      };
    }

    this.state.mapStyle.modifyLayer(layerId, newLayer);
  }


  onLayerIdChange = (oldId, newId) => {
    this.state.mapStyle.renameLayer(oldId, newId)
  }

  forceUpdate () {
    this.setState({
      idx: (this.state.idx || 0)+1
    })
  }

  onLayerChanged = (layer) => {
    this.state.mapStyle.modifyLayer(layer.id, layer)
  }

  setMapState = (newState) => {
    this.state.mapStyle.replace(newState);
  }

  // fetchSources() {
  //   const sourceList = {...this.state.sources};

  //   for(let [key, val] of Object.entries(this.state.mapStyle.sources)) {
  //     if(sourceList.hasOwnProperty(key)) {
  //       continue;
  //     }

  //     sourceList[key] = {
  //       type: val.type,
  //       layers: []
  //     };

  //     if(!this.state.sources.hasOwnProperty(key) && val.type === "vector" && val.hasOwnProperty("url")) {
  //       let url = val.url;
  //       try {
  //         url = normalizeSourceURL(url, MapboxGl.accessToken);
  //       } catch(err) {
  //         console.warn("Failed to normalizeSourceURL: ", err);
  //       }

  //       try {
  //         url = setFetchAccessToken(url, this.state.mapStyle)
  //       } catch(err) {
  //         console.warn("Failed to setFetchAccessToken: ", err);
  //       }

  //       fetch(url, {
  //         mode: 'cors',
  //       })
  //         .then((response) => {
  //           return response.json();
  //         })
  //         .then((json) => {
  //           if(!json.hasOwnProperty("vector_layers")) {
  //             return;
  //           }

  //           // Create new objects before setState
  //           const sources = Object.assign({}, this.state.sources);

  //           for(let layer of json.vector_layers) {
  //             sources[key].layers.push(layer.id)
  //           }

  //           console.debug("Updating source: "+key);
  //           this.setState({
  //             sources: sources
  //           });
  //         })
  //         .catch((err) => {
  //           console.error("Failed to process sources for '%s'", url, err);
  //         })
  //     }
  //   }

  //   if(!isEqual(this.state.sources, sourceList)) {
  //     console.debug("Setting sources");
  //     this.setState({
  //       sources: sourceList
  //     })
  //   }
  // }

  mapRenderer() {
    const mapProps = {
      mapStyle: style.replaceAccessTokens(this.state.mapStyle.current, {allowFallback: true}),
      options: this.state.mapOptions,
      onDataChange: (e) => {
        this.layerWatcher.analyzeMap(e.map)
        this.fetchSources();
      },
    }

    const metadata = this.state.mapStyle.current.metadata || {}
    const renderer = metadata['maputnik:renderer'] || 'mbgljs'

    let mapElement;

    let filterName;
    if(this.state.mapState.match(/^filter-/)) {
      filterName = this.state.mapState.replace(/^filter-/, "");
    }

    // Check if OL code has been loaded?
    if(renderer === 'ol') {
      mapElement = <OpenLayersMap
        {...mapProps}
      />
    } else {
      mapElement = <MapboxGlMap {...mapProps}
        inspectModeEnabled={this.state.mapState === "inspect"}
        highlightedLayer={this.state.mapStyle.current.layers[this.state.selectedLayerIndex]}
        onLayerSelect={this.onLayerSelect}
        filter={filterName}
      />
    }

    const elementStyle = {};
    if (filterName) {
      elementStyle.filter = `url('#${filterName}')`;
    };

    return <div style={elementStyle} className="maputnik-map__container">
      {mapElement}
    </div>
  }

  onLayerSelect = (layerId) => {
    const idx = style.indexOfLayer(this.state.mapStyle.current.layers, layerId)
    this.setState({ selectedLayerIndex: idx })
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

  render() {
    const layers = this.state.mapStyle.current.layers || [];
    const selectedLayer = layers.length > 0 ? layers[this.state.selectedLayerIndex] : null;

    const toolbar = <Toolbar
      mapState={this.state.mapState}
      mapStyle={this.state.mapStyle.current}
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
      onAddLayer={this.onAddLayer}
      onLayerSelect={this.onLayerSelect}
      selectedLayerIndex={this.state.selectedLayerIndex}
      layers={layers}
      sources={this.state.sources}
    />

    const layerEditor = selectedLayer ? <LayerEditor
      layer={selectedLayer}
      layerIndex={this.state.selectedLayerIndex}
      isFirstLayer={this.state.selectedLayerIndex < 1}
      isLastLayer={this.state.selectedLayerIndex === this.state.mapStyle.current.layers.length-1}
      sources={this.state.sources}
      vectorLayers={this.state.vectorLayers}
      spec={this.state.spec}
      onMoveLayer={this.onMoveLayer}
      onLayerChanged={this.onLayerChanged}
      onLayerDestroy={this.onLayerDestroy}
      onLayerCopy={this.onLayerCopy}
      onLayerVisibilityToggle={this.onLayerVisibilityToggle}
      onLayerIdChange={this.onLayerIdChange}
    /> : null

    const bottomPanel = (this.state.errors.length + this.state.infos.length) > 0 ? <MessagePanel
      errors={this.state.errors}
      infos={this.state.infos}
    /> : null


    const modals = <div>
      <ShortcutsModal
        ref={(el) => this.shortcutEl = el}
        isOpen={this.state.isOpen.shortcuts}
        onOpenToggle={this.toggleModal.bind(this, 'shortcuts')}
      />
      <SettingsModal
        mapStyle={this.state.mapStyle.current}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.settings}
        onOpenToggle={this.toggleModal.bind(this, 'settings')}
      />
      <ExportModal
        mapStyle={this.state.mapStyle.current}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.export}
        onOpenToggle={this.toggleModal.bind(this, 'export')}
      />
      <OpenModal
        isOpen={this.state.isOpen.open}
        onStyleOpen={this.onStyleChanged}
        onOpenToggle={this.toggleModal.bind(this, 'open')}
      />
      <SourcesModal
        mapStyle={this.state.mapStyle.current}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.sources}
        onOpenToggle={this.toggleModal.bind(this, 'sources')}
      />
      <SurveyModal
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
