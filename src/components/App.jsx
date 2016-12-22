import React from 'react'
import { saveAs } from 'file-saver'

import MapboxGlMap from './map/MapboxGlMap'
import OpenLayers3Map from './map/OpenLayers3Map'
import LayerList from './layers/LayerList'
import LayerEditor from './layers/LayerEditor'
import Toolbar from './Toolbar'
import AppLayout from './AppLayout'

import style from '../libs/style.js'
import { loadDefaultStyle, SettingsStore, StyleStore } from '../libs/stylestore'
import { ApiStyleStore } from '../libs/apistore'
import LayerWatcher from '../libs/layerwatcher'


export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.layerWatcher = new LayerWatcher()
    this.styleStore = new ApiStyleStore()
    this.styleStore.supported(isSupported => {
      if(!isSupported) {
        console.log('Falling back to local storage for storing styles')
        this.styleStore = new StyleStore()
      }
      this.styleStore.latestStyle(mapStyle => this.onStyleChanged(mapStyle))
    })

    this.settingsStore = new SettingsStore()
    this.state = {
      accessToken: this.settingsStore.accessToken,
      mapStyle: style.emptyStyle,
      selectedLayerIndex: 0,
    }
  }

  onReset() {
    this.styleStore.purge()
    loadDefaultStyle(mapStyle => this.onStyleOpen(mapStyle))
  }

  onStyleDownload() {
    const mapStyle = this.state.mapStyle
    const blob = new Blob([JSON.stringify(mapStyle, null, 4)], {type: "application/json;charset=utf-8"});
    saveAs(blob, mapStyle.id + ".json");
  }

  saveStyle(snapshotStyle) {
    snapshotStyle.modified = new Date().toJSON()
    this.styleStore.save(snapshotStyle)
  }

  onStyleChanged(newStyle) {
    this.saveStyle(newStyle)
    this.setState({ mapStyle: newStyle })
  }

  onAccessTokenChanged(newToken) {
    this.settingsStore.accessToken = newToken
    this.setState({ accessToken: newToken })
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

  mapRenderer() {
    const mapProps = {
      mapStyle: this.state.mapStyle,
      accessToken: this.state.accessToken,
      onMapLoaded: (map) => {
        this.layerWatcher.map = map
      }
    }

    const metadata = this.state.mapStyle.metadata || {}
    const renderer = metadata['maputnik:renderer'] || 'mbgljs'

    // Check if OL3 code has been loaded?
    if(renderer === 'ol3') {
      return <OpenLayers3Map {...mapProps} />
    } else {
      return  <MapboxGlMap {...mapProps} />
    }
  }

  onLayerSelect(layerId) {
    const idx = style.indexOfLayer(this.state.mapStyle.layers, layerId)
    this.setState({ selectedLayerIndex: idx })
  }

  render() {
    const layers = this.state.mapStyle.layers || []
    const selectedLayer = layers.length > 0 ? layers[this.state.selectedLayerIndex] : null

    const toolbar = <Toolbar
      mapStyle={this.state.mapStyle}
      onStyleChanged={this.onStyleChanged.bind(this)}
      onStyleOpen={this.onStyleChanged.bind(this)}
      onStyleDownload={this.onStyleDownload.bind(this)}
    />

    const layerList = <LayerList
      onLayersChange={this.onLayersChange.bind(this)}
      onLayerSelect={this.onLayerSelect.bind(this)}
      selectedLayerIndex={this.state.selectedLayerIndex}
      layers={layers}
    />

    const layerEditor = selectedLayer ? <LayerEditor
      layer={selectedLayer}
      sources={this.layerWatcher.sources}
      vectorLayers={this.layerWatcher.vectorLayers}
      onLayerChanged={this.onLayerChanged.bind(this)}
      onLayerIdChange={this.onLayerIdChange.bind(this)}
    /> : null

    return <AppLayout
      toolbar={toolbar}
      layerList={layerList}
      layerEditor={layerEditor}
      map={this.mapRenderer()}
    />
  }
}

