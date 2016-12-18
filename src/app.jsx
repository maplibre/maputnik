import React from 'react'
import {saveAs} from 'file-saver'

import Drawer from 'rebass/dist/Drawer'
import Container from 'rebass/dist/Container'
import Block from 'rebass/dist/Block'
import Fixed from 'rebass/dist/Fixed'

import { MapboxGlMap } from './gl.jsx'
import { OpenLayers3Map } from './ol3.jsx'
import { LayerList } from './layers/list.jsx'
import { LayerEditor } from './layers/editor.jsx'
import {Toolbar} from './toolbar.jsx'
import style from './style.js'
import { loadDefaultStyle, SettingsStore, StyleStore } from './stylestore.js'
import { ApiStyleStore } from './apistore.js'

import theme from './theme.js'
import { colors, fullHeight } from './theme.js'
import './index.css'

export default class App extends React.Component {
  static childContextTypes = {
    rebass: React.PropTypes.object,
    reactIconBase: React.PropTypes.object
  }

  constructor(props) {
    super(props)

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
      selectedLayerId: null,
    }
  }

  onReset() {
    this.styleStore.purge()
    loadDefaultStyle(mapStyle => this.onStyleUpload(mapStyle))
  }

  getChildContext() {
    return {
      rebass: theme,
      reactIconBase: { size: 20 }
    }
  }

  onStyleDownload() {
    const mapStyle = style.toJSON(this.state.mapStyle)
    const blob = new Blob([JSON.stringify(mapStyle, null, 4)], {type: "application/json;charset=utf-8"});
    saveAs(blob, mapStyle.id + ".json");
    this.onStyleSave()
  }

  onStyleUpload(newStyle) {
    const savedStyle = this.styleStore.save(newStyle)
    this.setState({ mapStyle: savedStyle })
  }

  onStyleSave() {
    const snapshotStyle = this.state.mapStyle.set('modified', new Date().toJSON())
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

  onLayersChanged(changedLayers) {
    const changedStyle = this.state.mapStyle.set('layers', changedLayers)
    this.onStyleChanged(changedStyle)
  }

  onLayerChanged(layer) {
    console.log('layer changed', layer)
    const layers = this.state.mapStyle.get('layers')
    const changedLayers = layers.set(layer.get('id'), layer)
    this.onLayersChanged(changedLayers)
  }

  onLayerChanged(layer) {
    const changedStyle = this.state.mapStyle.setIn(['layers', layer.get('id')], layer)
    this.onStyleChanged(changedStyle)
  }

  mapRenderer() {
    const mapProps = {
      mapStyle: this.state.mapStyle,
      accessToken: this.state.accessToken,
    }
    const renderer = this.state.mapStyle.getIn(['metadata', 'maputnik:renderer'], 'mbgljs')
    if(renderer === 'ol3') {
      return  <OpenLayers3Map {...mapProps} />
    } else {
      return  <MapboxGlMap {...mapProps} />
    }
  }

  onLayerSelected(layerId) {
    this.setState({ selectedLayerId: layerId })
  }

  render() {
    const selectedLayer = this.state.mapStyle.getIn(['layers', this.state.selectedLayerId], null)
    return <div style={{ fontFamily: theme.fontFamily, color: theme.color, fontWeight: 300 }}>
      <Toolbar
        mapStyle={this.state.mapStyle}
        onStyleChanged={this.onStyleChanged.bind(this)}
        onStyleSave={this.onStyleSave.bind(this)}
        onStyleUpload={this.onStyleUpload.bind(this)}
        onStyleDownload={this.onStyleDownload.bind(this)}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        height: "100%",
        top: 50,
        left: 0,
        zIndex: 100,
        width: 180,
        overflow: "hidden",
        backgroundColor: colors.gray
      }}>
        <LayerList
          onLayersChanged={this.onLayersChanged.bind(this)}
          onLayerSelected={this.onLayerSelected.bind(this)}
          layers={this.state.mapStyle.get('layers')}
        />
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        height: "100%",
        top: 50,
        left: 180,
        zIndex: 100,
        width: 300,
        backgroundColor: colors.gray}
      }>
      {selectedLayer && <LayerEditor layer={selectedLayer} onLayerChanged={this.onLayerChanged.bind(this)} sources={this.state.mapStyle.get('sources')}/>}
      </div>
      {this.mapRenderer()}
    </div>
  }
}

