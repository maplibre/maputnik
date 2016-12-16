import React from 'react'
import style from './style.js'
import { Map } from './map.jsx'
import ol from 'openlayers'
import olms from 'ol-mapbox-style'

export class OpenLayers3Map extends Map {
  constructor(props) {
    super(props)

    const tilegrid = ol.tilegrid.createXYZ({tileSize: 512, maxZoom: 22})
    this.resolutions = tilegrid.getResolutions()
    this.layer = new ol.layer.VectorTile({
      source: new ol.source.VectorTile({
        attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
          '© <a href="http://www.openstreetmap.org/copyright">' +
          'OpenStreetMap contributors</a>',
        format: new ol.format.MVT(),
        tileGrid: tilegrid,
        tilePixelRatio: 8,
        url: 'http://osm2vectortiles-0.tileserver.com/v2/{z}/{x}/{y}.pbf'
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    const jsonStyle = style.toJSON(nextProps.mapStyle)
    const styleFunc = olms.getStyleFunction(jsonStyle, 'mapbox', this.resolutions)
    this.layer.setStyle(styleFunc)
    this.state.map.render()
  }


  componentDidMount() {
    const jsonStyle = style.toJSON(this.props.mapStyle)
    const styleFunc = olms.getStyleFunction(jsonStyle, 'mapbox', this.resolutions)
    this.layer.setStyle(styleFunc)

    const map = new ol.Map({
    target: this.container,
      layers: [this.layer],
      view: new ol.View({
        center: jsonStyle.center,
        zoom: jsonStyle.zoom,
      })
    })
    map.addControl(new ol.control.Zoom());
    this.setState({ map });
  }
}
