import React from 'react'
import Mousetrap from 'mousetrap'

import MapboxGlMap from './map/MapboxGlMap'
import OpenLayers3Map from './map/OpenLayers3Map'
import LayerList from './layers/LayerList'
import LayerEditor from './layers/LayerEditor'
import Toolbar from './Toolbar'
import AppLayout from './AppLayout'
import MessagePanel from './MessagePanel'

import { downloadGlyphsMetadata, downloadSpriteMetadata } from '../libs/metadata'
import styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
import style from '../libs/style.js'
import { initialStyleUrl, loadStyleUrl } from '../libs/urlopen'
import { undoMessages, redoMessages } from '../libs/diffmessage'
import { loadDefaultStyle, StyleStore } from '../libs/stylestore'
import { ApiStyleStore } from '../libs/apistore'
import { RevisionStore } from '../libs/revisions'
import LayerWatcher from '../libs/layerwatcher'
import tokens from '../config/tokens.json'

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
      })
    }

    this.state = {
      errors: [],
      infos: [],
      mapStyle: style.emptyStyle,
      selectedLayerIndex: 0,
      sources: {},
      vectorLayers: {},
      inspectModeEnabled: false,
      spec: styleSpec.latest,
    }

    this.layerWatcher = new LayerWatcher({
      onSourcesChange: v => this.setState({ sources: v }),
      onVectorLayersChange: v => this.setState({ vectorLayers: v })
    })
  }

  componentDidMount() {
    Mousetrap.bind(['ctrl+z'], this.onUndo.bind(this));
    Mousetrap.bind(['ctrl+y'], this.onRedo.bind(this));
  }

  componentWillUnmount() {
    Mousetrap.unbind(['ctrl+z'], this.onUndo.bind(this));
    Mousetrap.unbind(['ctrl+y'], this.onRedo.bind(this));
  }

  onReset() {
    this.styleStore.purge()
    loadDefaultStyle(mapStyle => this.onStyleOpen(mapStyle))
  }

  saveStyle(snapshotStyle) {
    this.styleStore.save(snapshotStyle)
  }

  updateFonts(urlTemplate) {
    const metadata = this.state.mapStyle.metadata || {}
    const accessToken = metadata['maputnik:openmaptiles_access_token'] || tokens.openmaptiles
    downloadGlyphsMetadata(urlTemplate.replace('{key}', accessToken), fonts => {
      this.setState({ spec: updateRootSpec(this.state.spec, 'glyphs', fonts)})
    })
  }

  updateIcons(baseUrl) {
    downloadSpriteMetadata(baseUrl, icons => {
      this.setState({ spec: updateRootSpec(this.state.spec, 'sprite', icons)})
    })
  }

  onStyleChanged(newStyle, save=true) {
    if(newStyle.glyphs !== this.state.mapStyle.glyphs) {
      this.updateFonts(newStyle.glyphs)
    }
    if(newStyle.sprite !== this.state.mapStyle.sprite) {
      this.updateIcons(newStyle.sprite)
    }

    const errors = styleSpec.validate(newStyle, styleSpec.latest)
    if(errors.length === 0) {
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

  onLayersChange(changedLayers) {
    const changedStyle = {
      ...this.state.mapStyle,
      layers: changedLayers
    }
    this.onStyleChanged(changedStyle)
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

  mapRenderer() {
    const mapProps = {
      mapStyle: style.replaceAccessToken(this.state.mapStyle),
      onDataChange: (e) => {
        this.layerWatcher.analyzeMap(e.map)
      },
    }

    const metadata = this.state.mapStyle.metadata || {}
    const renderer = metadata['maputnik:renderer'] || 'mbgljs'

    // Check if OL3 code has been loaded?
    if(renderer === 'ol3') {
      return <OpenLayers3Map {...mapProps} />
    } else {
      return  <MapboxGlMap {...mapProps}
        inspectModeEnabled={this.state.inspectModeEnabled}
        highlightedLayer={this.state.mapStyle.layers[this.state.selectedLayerIndex]} />
    }
  }

  onLayerSelect(layerId) {
    const idx = style.indexOfLayer(this.state.mapStyle.layers, layerId)
    this.setState({ selectedLayerIndex: idx })
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
    />

    const layerList = <LayerList
      onLayersChange={this.onLayersChange.bind(this)}
      onLayerSelect={this.onLayerSelect.bind(this)}
      selectedLayerIndex={this.state.selectedLayerIndex}
      layers={layers}
      sources={this.state.sources}
    />

    const layerEditor = selectedLayer ? <LayerEditor
      layer={selectedLayer}
      sources={this.state.sources}
      vectorLayers={this.state.vectorLayers}
      spec={this.state.spec}
      onLayerChanged={this.onLayerChanged.bind(this)}
      onLayerIdChange={this.onLayerIdChange.bind(this)}
    /> : null

    const bottomPanel = (this.state.errors.length + this.state.infos.length) > 0 ? <MessagePanel
      errors={this.state.errors}
      infos={this.state.infos}
    /> : null

    return <AppLayout
      toolbar={toolbar}
      layerList={layerList}
      layerEditor={layerEditor}
      map={this.mapRenderer()}
      bottom={bottomPanel}
    />
  }
}
