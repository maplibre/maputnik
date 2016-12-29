import React from 'react'
import ReactDOM from 'react-dom'
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'
import colors from '../../config/colors'
import style from '../../libs/style'
import FeaturePropertyPopup from './FeaturePropertyPopup'
import { colorHighlightedLayer, generateColoredLayers } from '../../libs/stylegen'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../../mapboxgl.css'

function convertInspectStyle(mapStyle, sources, highlightedLayer) {
  let coloredLayers = generateColoredLayers(sources)
  const layer = colorHighlightedLayer(highlightedLayer)

  if(layer) {
    const idx = style.indexOfLayer(coloredLayers, layer.id)
    coloredLayers.splice(idx, 1)
    coloredLayers.push(layer)
  }

  const newStyle = {
    ...mapStyle,
    layers: [
      {
        "id": "background",
        "type": "background",
        "paint": {
          "background-color": colors.black,
        }
      },
      ...coloredLayers,
    ]
  }
  return newStyle
}

function renderPopup(features) {
  var mountNode = document.createElement('div');
  ReactDOM.render(<FeaturePropertyPopup features={features} />, mountNode)
  return mountNode.innerHTML;
}

export default class InspectionMap extends React.Component {
  static propTypes = {
    onDataChange: React.PropTypes.func,
    sources: React.PropTypes.object,
    originalStyle: React.PropTypes.object,
    highlightedLayer: React.PropTypes.object,
    style: React.PropTypes.object,
  }

  static defaultProps = {
    onMapLoaded: () => {},
    onTileLoaded: () => {},
  }

  constructor(props) {
    super(props)
    this.state = { map: null }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.state.map) return

    this.state.map.setStyle(convertInspectStyle(nextProps.mapStyle, this.props.sources, nextProps.highlightedLayer), { diff: true})
  }

  componentDidMount() {
    MapboxGl.accessToken = this.props.accessToken

    const map = new MapboxGl.Map({
      container: this.container,
      style: convertInspectStyle(this.props.mapStyle, this.props.sources, this.props.highlightedLayer),
      hash: true,
    })

    const nav = new MapboxGl.NavigationControl();
    map.addControl(nav, 'top-right');

    map.on("style.load", () => {
      this.setState({ map });
    })

    map.on("data", e => {
      if(e.dataType !== 'tile') return
      this.props.onDataChange({
        map: this.state.map
      })
    })

    map.on('click', this.displayPopup.bind(this))
    map.on('mousemove', function(e) {
      var features = map.queryRenderedFeatures(e.point, { layers: this.layers })
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''
    })
  }

  displayPopup(e) {
    const features = this.state.map.queryRenderedFeatures(e.point, {
      layers: this.layers
    });

    if (!features.length) {
      return
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    const popup = new MapboxGl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(renderPopup(features))
      .addTo(this.state.map)
  }

  render() {
    return <div
    ref={x => this.container = x}
    style={{
      position: "fixed",
      top: 0,
      bottom: 0,
      height: "100%",
      width: "100%",
      ...this.props.style,
    }}></div>
  }
}
