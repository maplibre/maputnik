import React from 'react'
import { saveAs } from 'file-saver'

import MapboxGlMap from './map/MapboxGlMap'
import OpenLayers3Map from './map/OpenLayers3Map'
import LayerList from './layers/LayerList'
import LayerEditor from './layers/LayerEditor'
import Toolbar from './Toolbar'
import Layout from './Layout'

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
      this.styleStore.latestStyle(mapStyle => this.onStyleUpload(mapStyle))
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
    loadDefaultStyle(mapStyle => this.onStyleUpload(mapStyle))
  }

  onStyleDownload() {
    const mapStyle = this.state.mapStyle
    const blob = new Blob([JSON.stringify(mapStyle, null, 4)], {type: "application/json;charset=utf-8"});
    saveAs(blob, mapStyle.id + ".json");
    this.onStyleSave()
  }

  onStyleUpload(newStyle) {
    console.log('upload', newStyle)
    const savedStyle = this.styleStore.save(newStyle)
    this.setState({ mapStyle: savedStyle })
  }

  onStyleSave() {
    const snapshotStyle = this.state.mapStyle.modified = new Date().toJSON()
    this.setState({ mapStyle: snapshotStyle })
    console.log('Save')
    this.styleStore.save(snapshotStyle)
  }

  onStyleChanged(newStyle) {
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
    this.setState({ mapStyle: changedStyle })
  }

  onLayerChanged(layer) {
    const changedStyle = {
      ...this.state.mapStyle,
      layers: {
        ...this.state.mapStyle.layers,
        [layer.id]: layer
      }
    }
    this.setState({ mapStyle: changedStyle })
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
    if(renderer === 'ol3') {
      return  <OpenLayers3Map {...mapProps} />
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
      onStyleSave={this.onStyleSave.bind(this)}
      onStyleUpload={this.onStyleUpload.bind(this)}
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
    /> : null

    return <Layout
      toolbar={toolbar}
      layerList={layerList}
      layerEditor={layerEditor}
      map={this.mapRenderer()}
    />
  }
}

