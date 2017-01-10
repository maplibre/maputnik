import React from 'react'
import style from '../../libs/style.js'
import isEqual from 'lodash.isequal'
import { loadJSON } from '../../libs/urlopen'

function suitableVectorSource(mapStyle) {
  const sources = Object.keys(mapStyle.sources)
    .map(sourceId => {
      return {
        id: sourceId,
        source: mapStyle.sources[sourceId]
      }
    })
    .filter(({source}) => source.type === 'vector')
  return sources[0]
}

function toVectorLayer(source, tilegrid, cb) {
  function newMVTLayer(tileUrl) {
    const ol = require('openlayers')
    return new ol.layer.VectorTile({
      source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        tileGrid: tilegrid,
        tilePixelRatio: 8,
        url: tileUrl
      })
    })
  }

  if(!source.tiles) {
    sourceFromTileJSON(source.url, tileSource => {
      cb(newMVTLayer(tileSource.tiles[0]))
    })
  } else {
    cb(newMVTLayer(source.tiles[0]))
  }
}

function sourceFromTileJSON(url, cb) {
  loadJSON(url, null, tilejson => {
    if(!tilejson) return
    cb({
      type: 'vector',
      tiles: tilejson.tiles,
      minzoom: tilejson.minzoom,
      maxzoom: tilejson.maxzoom,
    })
  })
}

class OpenLayers3Map extends React.Component {
  static propTypes = {
    onDataChange: React.PropTypes.func,
    mapStyle: React.PropTypes.object.isRequired,
    accessToken: React.PropTypes.string,
  }

  static defaultProps = {
    onMapLoaded: () => {},
    onDataChange: () => {},
  }

  constructor(props) {
    super(props)
    this.tilegrid = null
    this.resolutions = null
    this.layer = null
    this.map = null
  }

  updateStyle(newMapStyle) {
    const oldSource = suitableVectorSource(this.props.mapStyle)
    const newSource = suitableVectorSource(newMapStyle)
    const resolutions = this.resolutions

      function setStyleFunc(map, layer) {
        const olms = require('ol-mapbox-style')
        const styleFunc = olms.getStyleFunction(newMapStyle, newSource.id, resolutions)
        layer.setStyle(styleFunc)
        //NOTE: We need to mark the source as changed in order
        //to trigger a rerender
        layer.getSource().changed()
        map.render()
    }

    if(newSource) {
      if(this.layer && !isEqual(oldSource, newSource)) {
        this.map.removeLayer(this.layer)
        this.layer = null
      }

      if(!this.layer) {
        toVectorLayer(newSource.source, this.tilegrid, vectorLayer => {
          this.layer = vectorLayer
          this.map.addLayer(this.layer)
          setStyleFunc(this.map, this.layer)
        })
      } else {
        setStyleFunc(this.map, this.layer)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    require.ensure(["openlayers", "ol-mapbox-style"], () => {
      if(!this.map || !this.resolutions) return
      this.updateStyle(nextProps.mapStyle)
    })
  }

  componentDidMount() {
    //Load OpenLayers dynamically once we need it
    //TODO: Make this more convenient
    require.ensure(["openlayers", "ol-mapbox-style"], ()=> {
      console.log('Loaded OpenLayers3 renderer')

      const ol = require('openlayers')
      const olms = require('ol-mapbox-style')

      this.tilegrid = ol.tilegrid.createXYZ({tileSize: 512, maxZoom: 22})
      this.resolutions = this.tilegrid.getResolutions()

      const map = new ol.Map({
        target: this.container,
        layers: [],
        view: new ol.View({
          zoom: 2,
          center: [52.5, -78.4]
        })
      })
      map.addControl(new ol.control.Zoom())
      this.map = map
      this.updateStyle(this.props.mapStyle)
    })
  }

  render() {
    return <div
      ref={x => this.container = x}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        height: "100%",
        width: "75%",
        ...this.props.style,
      }}>
    </div>
  }
}

export default OpenLayers3Map
