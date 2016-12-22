import React from 'react'
import Map from './Map'
import style from '../../libs/style.js'

class OpenLayers3Map extends Map {
  constructor(props) {
    super(props)

    this.state = {
      map: null,
      ol: null,
      olms: null
    }

    //Load OpenLayers dynamically once we need it
    //TODO: Make this more convenient
    require.ensure(["openlayers", "ol-mapbox-style"], ()=> {
      const ol = require('openlayers')
      const olms = require('ol-mapbox-style')

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

      this.setState({
        ol: ol,
        olms: olms,
      })
      console.log('Loaded OpenLayers3 renderer')
    })
  }

  componentWillReceiveProps(nextProps) {
    const olms = this.state.olms
    const ol = this.state.ol
    if(!olms || !ol) return

    const jsonStyle = style.toJSON(nextProps.mapStyle)
    const styleFunc = olms.getStyleFunction(jsonStyle, 'mapbox', this.resolutions)
    this.layer.setStyle(styleFunc)
    this.state.map.render()
  }

  componentDidMount() {
    const olms = this.state.olms
    const ol = this.state.ol
    if(!olms || !ol) return

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

export default OpenLayers3Map
