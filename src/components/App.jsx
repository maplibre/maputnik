import React from 'react'
import Mousetrap from 'mousetrap'
import cloneDeep from 'lodash.clonedeep'
import clamp from 'lodash.clamp'
import {arrayMove} from 'react-sortable-hoc';
import url from 'url'

import MapboxGlMap from './map/MapboxGlMap'
import OpenLayers3Map from './map/OpenLayers3Map'
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

import { downloadGlyphsMetadata, downloadSpriteMetadata } from '../libs/metadata'
import * as styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
import style from '../libs/style.js'
import { initialStyleUrl, loadStyleUrl } from '../libs/urlopen'
import { undoMessages, redoMessages } from '../libs/diffmessage'
import { loadDefaultStyle, StyleStore } from '../libs/stylestore'
import { ApiStyleStore } from '../libs/apistore'
import { RevisionStore } from '../libs/revisions'
import LayerWatcher from '../libs/layerwatcher'
import tokens from '../config/tokens.json'
import isEqual from 'lodash.isequal'
import Debug from '../libs/debug'

import MapboxGl from 'mapbox-gl'
import mapboxUtil from 'mapbox-gl/src/util/mapbox'


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
    this.revisionStore = new RevisionStore()
    this.styleStore = new ApiStyleStore({
      onLocalStyleChange: mapStyle => this.onStyleChanged(mapStyle, false)
    })

    
    const keyCodes = {
      "esc": 27,
      "?": 191,
      "o": 79,
      "e": 69,
      "s": 83,
      "d": 68,
      "i": 73,
      "m": 77,
    }

    const shortcuts = [
      {
        keyCode: keyCodes["?"],
        handler: () => {
          this.toggleModal("shortcuts");
        }
      },
      {
        keyCode: keyCodes["o"],
        handler: () => {
          this.toggleModal("open");
        }
      },
      {
        keyCode: keyCodes["e"],
        handler: () => {
          this.toggleModal("export");
        }
      },
      {
        keyCode: keyCodes["d"],
        handler: () => {
          this.toggleModal("sources");
        }
      },
      {
        keyCode: keyCodes["s"],
        handler: () => {
          this.toggleModal("settings");
        }
      },
      {
        keyCode: keyCodes["i"],
        handler: () => {
          this.changeInspectMode();
        }
      },
      {
        keyCode: keyCodes["m"],
        handler: () => {
          document.querySelector(".mapboxgl-canvas").focus();
        }
      },
    ]

    document.body.addEventListener("keyup", (e) => {
      if(e.keyCode === keyCodes["esc"]) {
        e.target.blur();
        document.body.focus();
      }
      else if(document.activeElement === document.body) {
        const shortcut = shortcuts.find((shortcut) => {
          return (shortcut.keyCode === e.keyCode)
        })

        if(shortcut) {
          shortcut.handler(e);
        }
      }
    })

    const styleUrl = initialStyleUrl()
    if(styleUrl) {
      this.styleStore = new StyleStore()
      loadStyleUrl(styleUrl, mapStyle => this.onStyleChanged(mapStyle))
    } else {
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
      inspectModeEnabled: false,
      spec: styleSpec.latest,
      isOpen: {
        settings: false,
        sources: false,
        open: false,
        shortcuts: false,
        export: false,
      },
      mapOptions: {
        showTileBoundaries: !!queryObj.showTileBoundaries
      },
      mapFilter: queryObj["color-blindness-emulation"],
    }

    this.layerWatcher = new LayerWatcher({
      onVectorLayersChange: v => this.setState({ vectorLayers: v })
    })
  }

  componentDidMount() {
    Mousetrap.bind(['mod+z'], this.onUndo.bind(this));
    Mousetrap.bind(['mod+y', 'mod+shift+z'], this.onRedo.bind(this));
  }

  componentWillUnmount() {
    Mousetrap.unbind(['mod+z'], this.onUndo.bind(this));
    Mousetrap.unbind(['mod+y', 'mod+shift+z'], this.onRedo.bind(this));
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

  onStyleChanged(newStyle, save=true) {

    const errors = styleSpec.validate(newStyle, styleSpec.latest)
    if(errors.length === 0) {

      if(newStyle.glyphs !== this.state.mapStyle.glyphs) {
        this.updateFonts(newStyle.glyphs)
      }
      if(newStyle.sprite !== this.state.mapStyle.sprite) {
        this.updateIcons(newStyle.sprite)
      }

      this.revisionStore.addRevision(newStyle)
      if(save) this.saveStyle(newStyle)
      this.setState({
        mapStyle: newStyle,
        errors: [],
      })
    } else {
      this.setState({
        errors: errors.map(err => err.message)
      })
    }

    this.fetchSources();
  }

  onUndo() {
    const activeStyle = this.revisionStore.undo()
    const messages = undoMessages(this.state.mapStyle, activeStyle)
    this.saveStyle(activeStyle)
    this.setState({
      mapStyle: activeStyle,
      infos: messages,
    })
  }

  onRedo() {
    const activeStyle = this.revisionStore.redo()
    const messages = redoMessages(this.state.mapStyle, activeStyle)
    this.saveStyle(activeStyle)
    this.setState({
      mapStyle: activeStyle,
      infos: messages,
    })
  }

  onMoveLayer(move) {
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

  onLayersChange(changedLayers) {
    const changedStyle = {
      ...this.state.mapStyle,
      layers: changedLayers
    }
    this.onStyleChanged(changedStyle)
  }

  onLayerDestroy(layerId) {
    let layers = this.state.mapStyle.layers;
    const remainingLayers = layers.slice(0);
    const idx = style.indexOfLayer(remainingLayers, layerId)
    remainingLayers.splice(idx, 1);
    this.onLayersChange(remainingLayers);
  }

  onLayerCopy(layerId) {
    let layers = this.state.mapStyle.layers;
    const changedLayers = layers.slice(0)
    const idx = style.indexOfLayer(changedLayers, layerId)

    const clonedLayer = cloneDeep(changedLayers[idx])
    clonedLayer.id = clonedLayer.id + "-copy"
    changedLayers.splice(idx, 0, clonedLayer)
    this.onLayersChange(changedLayers)
  }

  onLayerVisibilityToggle(layerId) {
    let layers = this.state.mapStyle.layers;
    const changedLayers = layers.slice(0)
    const idx = style.indexOfLayer(changedLayers, layerId)

    const layer = { ...changedLayers[idx] }
    const changedLayout = 'layout' in layer ? {...layer.layout} : {}
    changedLayout.visibility = changedLayout.visibility === 'none' ? 'visible' : 'none'

    layer.layout = changedLayout
    changedLayers[idx] = layer
    this.onLayersChange(changedLayers)
  }


  onLayerIdChange(oldId, newId) {
    const changedLayers = this.state.mapStyle.layers.slice(0)
    const idx = style.indexOfLayer(changedLayers, oldId)

    changedLayers[idx] = {
      ...changedLayers[idx],
      id: newId
    }

    this.onLayersChange(changedLayers)
  }

  onLayerChanged(layer) {
    const changedLayers = this.state.mapStyle.layers.slice(0)
    const idx = style.indexOfLayer(changedLayers, layer.id)
    changedLayers[idx] = layer

    this.onLayersChange(changedLayers)
  }

  changeInspectMode() {
    this.setState({
      inspectModeEnabled: !this.state.inspectModeEnabled
    })
  }

  fetchSources() {
    const sourceList = {...this.state.sources};

    for(let [key, val] of Object.entries(this.state.mapStyle.sources)) {
      if(sourceList.hasOwnProperty(key)) {
        continue;
      }

      sourceList[key] = {
        type: val.type,
        layers: []
      };

      if(!this.state.sources.hasOwnProperty(key) && val.type === "vector" && val.hasOwnProperty("url")) {
        let url = val.url;
        try {
          url = mapboxUtil.normalizeSourceURL(url, MapboxGl.accessToken);
        } catch(err) {
          console.warn("Failed to normalizeSourceURL: ", err);
        }

        fetch(url)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if(!json.hasOwnProperty("vector_layers")) {
              return;
            }

            // Create new objects before setState
            const sources = Object.assign({}, this.state.sources);

            for(let layer of json.vector_layers) {
              sources[key].layers.push(layer.id)
            }

            console.debug("Updating source: "+key);
            this.setState({
              sources: sources
            });
          })
          .catch((err) => {
            console.error("Failed to process sources for '%s'", url, err);
          })
      }
    }

    if(!isEqual(this.state.sources, sourceList)) {
      console.debug("Setting sources");
      this.setState({
        sources: sourceList
      })
    }
  }

  mapRenderer() {
    const mapProps = {
      mapStyle: style.replaceAccessToken(this.state.mapStyle, {allowFallback: true}),
      options: this.state.mapOptions,
      onDataChange: (e) => {
        this.layerWatcher.analyzeMap(e.map)
        this.fetchSources();
      },
    }

    const metadata = this.state.mapStyle.metadata || {}
    const renderer = metadata['maputnik:renderer'] || 'mbgljs'

    let mapElement;

    // Check if OL3 code has been loaded?
    if(renderer === 'ol3') {
      mapElement = <OpenLayers3Map {...mapProps} />
    } else {
      mapElement = <MapboxGlMap {...mapProps}
        inspectModeEnabled={this.state.inspectModeEnabled}
        highlightedLayer={this.state.mapStyle.layers[this.state.selectedLayerIndex]}
        onLayerSelect={this.onLayerSelect.bind(this)} />
    }

    const elementStyle = {
      "filter": `url('#${this.state.mapFilter}')`
    };

    return <div style={elementStyle}>
      {mapElement}
    </div>
  }

  onLayerSelect(layerId) {
    const idx = style.indexOfLayer(this.state.mapStyle.layers, layerId)
    this.setState({ selectedLayerIndex: idx })
  }

  toggleModal(modalName) {
    this.setState({
      isOpen: {
        ...this.state.isOpen,
        [modalName]: !this.state.isOpen[modalName]
      }
    })
  }

  render() {
    const layers = this.state.mapStyle.layers || []
    const selectedLayer = layers.length > 0 ? layers[this.state.selectedLayerIndex] : null
    const metadata = this.state.mapStyle.metadata || {}

    const toolbar = <Toolbar
      mapStyle={this.state.mapStyle}
      inspectModeEnabled={this.state.inspectModeEnabled}
      sources={this.state.sources}
      onStyleChanged={this.onStyleChanged.bind(this)}
      onStyleOpen={this.onStyleChanged.bind(this)}
      onInspectModeToggle={this.changeInspectMode.bind(this)}
      onToggleModal={this.toggleModal.bind(this)}
    />

    const layerList = <LayerList
      onMoveLayer={this.onMoveLayer.bind(this)}
      onLayerDestroy={this.onLayerDestroy.bind(this)}
      onLayerCopy={this.onLayerCopy.bind(this)}
      onLayerVisibilityToggle={this.onLayerVisibilityToggle.bind(this)}
      onLayersChange={this.onLayersChange.bind(this)}
      onLayerSelect={this.onLayerSelect.bind(this)}
      selectedLayerIndex={this.state.selectedLayerIndex}
      layers={layers}
      sources={this.state.sources}
    />

    const layerEditor = selectedLayer ? <LayerEditor
      layer={selectedLayer}
      layerIndex={this.state.selectedLayerIndex}
      isFirstLayer={this.state.selectedLayerIndex < 1}
      isLastLayer={this.state.selectedLayerIndex === this.state.mapStyle.layers.length-1}
      sources={this.state.sources}
      vectorLayers={this.state.vectorLayers}
      spec={this.state.spec}
      onMoveLayer={this.onMoveLayer.bind(this)}
      onLayerChanged={this.onLayerChanged.bind(this)}
      onLayerDestroy={this.onLayerDestroy.bind(this)}
      onLayerCopy={this.onLayerCopy.bind(this)}
      onLayerVisibilityToggle={this.onLayerVisibilityToggle.bind(this)}
      onLayerIdChange={this.onLayerIdChange.bind(this)}
    /> : null

    const bottomPanel = (this.state.errors.length + this.state.infos.length) > 0 ? <MessagePanel
      errors={this.state.errors}
      infos={this.state.infos}
    /> : null


    const modals = <div>
      <ShortcutsModal
        isOpen={this.state.isOpen.shortcuts}
        onOpenToggle={this.toggleModal.bind(this, 'shortcuts')}
      />
      <SettingsModal
        mapStyle={this.state.mapStyle}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.settings}
        onOpenToggle={this.toggleModal.bind(this, 'settings')}
      />
      <ExportModal
        mapStyle={this.state.mapStyle}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.export}
        onOpenToggle={this.toggleModal.bind(this, 'export')}
      />
      <OpenModal
        isOpen={this.state.isOpen.open}
        onStyleOpen={this.onStyleChanged.bind(this)}
        onOpenToggle={this.toggleModal.bind(this, 'open')}
      />
      <SourcesModal
        mapStyle={this.state.mapStyle}
        onStyleChanged={this.onStyleChanged}
        isOpen={this.state.isOpen.sources}
        onOpenToggle={this.toggleModal.bind(this, 'sources')}
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
