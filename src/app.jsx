import React from 'react'
import {saveAs} from 'file-saver'

import Drawer from 'rebass/dist/Drawer'
import Container from 'rebass/dist/Container'
import Block from 'rebass/dist/Block'
import Fixed from 'rebass/dist/Fixed'

import { MapboxGlMap } from './gl.jsx'
import { OpenLayers3Map } from './ol3.jsx'
import { LayerList } from './layers/list.jsx'
import {Toolbar} from './toolbar.jsx'
import style from './style.js'
import { loadDefaultStyle, SettingsStore, StyleStore } from './stylestore.js'
import { ApiStyleStore } from './apistore.js'

import theme from './theme.js'
import { colors, fullHeight } from './theme.js'
import './index.scss'

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
      workContext: "layers",
      currentStyle: style.emptyStyle,
      mapRenderer: 'gl',
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
    const mapStyle = style.toJSON(this.state.currentStyle)
    const blob = new Blob([JSON.stringify(mapStyle, null, 4)], {type: "application/json;charset=utf-8"});
    saveAs(blob, mapStyle.id + ".json");
    this.onStyleSave()
  }

  onStyleUpload(newStyle) {
    const savedStyle = this.styleStore.save(newStyle)
    this.setState({ currentStyle: savedStyle })
  }

  onStyleSave() {
    const snapshotStyle = this.state.currentStyle.set('modified', new Date().toJSON())
    this.setState({ currentStyle: snapshotStyle })
    console.log('Save')
    this.styleStore.save(snapshotStyle)
  }

  onStyleChanged(newStyle) {
    this.setState({ currentStyle: newStyle })
  }

  onOpenSettings() {
    //TODO: open settings modal
    //this.setState({ workContext: "settings" })
  }

  onOpenAbout() {
    //TODO: open about modal
    //this.setState({ workContext: "about" })
  }

  onOpenSources() {
    //TODO: open sources modal
    //this.setState({ workContext: "sources", })
  }

  onAccessTokenChanged(newToken) {
    this.settingsStore.accessToken = newToken
    this.setState({ accessToken: newToken })
  }

  onLayersChanged(changedLayers) {
    const changedStyle = this.props.mapStyle.set('layers', changedLayers)
    this.props.onStyleChanged(changedStyle)
  }

  mapRenderer() {
    const mapProps = {
      mapStyle: this.state.currentStyle,
      accessToken: this.state.accessToken,
    }
    const renderer = this.state.currentStyle.getIn(['metadata', 'maputnik:renderer'], 'mbgljs')
    if(renderer === 'ol3') {
      return  <OpenLayers3Map {...mapProps} />
    } else {
      return  <MapboxGlMap {...mapProps} />
    }
  }

  render() {
    return <div style={{ fontFamily: theme.fontFamily, color: theme.color, fontWeight: 300 }}>
      <Toolbar
        mapStyle={this.state.currentStyle}
        onStyleChanged={this.onStyleChanged.bind(this)}
        onStyleSave={this.onStyleSave.bind(this)}
        onStyleUpload={this.onStyleUpload.bind(this)}
        onStyleDownload={this.onStyleDownload.bind(this)}
      />
      <div style={{
        ...fullHeight,
        top: 50,
        left: 0,
        zIndex: 100,
        width: 300,
        overflow: "hidden",
        backgroundColor: colors.gray
      }}>
        <LayerList
          onLayersChanged={this.onLayersChanged.bind(this)}
          layers={this.state.currentStyle.get('layers')}
        />
      </div>
      {this.mapRenderer()}
    </div>
  }
}

