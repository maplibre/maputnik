import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import MapLibreGl from 'maplibre-gl'
import MapboxInspect from 'mapbox-gl-inspect'
import MapMaplibreGlLayerPopup from './MapMaplibreGlLayerPopup'
import MapMaplibreGlFeaturePropertyPopup from './MapMaplibreGlFeaturePropertyPopup'
import tokens from '../config/tokens.json'
import colors from 'mapbox-gl-inspect/lib/colors'
import Color from 'color'
import ZoomControl from '../libs/zoomcontrol'
import { colorHighlightedLayer } from '../libs/highlight'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../maplibregl.css'
import '../libs/maplibre-rtl'


const IS_SUPPORTED = MapLibreGl.supported();

function renderPopup(popup, mountNode) {
  ReactDOM.render(popup, mountNode);
  return mountNode;
}

function buildInspectStyle(originalMapStyle, coloredLayers, highlightedLayer) {
  const backgroundLayer = {
    "id": "background",
    "type": "background",
    "paint": {
      "background-color": '#1c1f24',
    }
  }

  const layer = colorHighlightedLayer(highlightedLayer)
  if(layer) {
    coloredLayers.push(layer)
  }

  const sources = {}
  Object.keys(originalMapStyle.sources).forEach(sourceId => {
    const source = originalMapStyle.sources[sourceId]
    if(source.type !== 'raster' && source.type !== 'raster-dem') {
      sources[sourceId] = source
    }
  })

  const inspectStyle = {
    ...originalMapStyle,
    sources: sources,
    layers: [backgroundLayer].concat(coloredLayers)
  }
  return inspectStyle
}

export default class MapMaplibreGl extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func,
    onLayerSelect: PropTypes.func.isRequired,
    mapStyle: PropTypes.object.isRequired,
    inspectModeEnabled: PropTypes.bool.isRequired,
    highlightedLayer: PropTypes.object,
    options: PropTypes.object,
    replaceAccessTokens: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onMapLoaded: () => {},
    onDataChange: () => {},
    onLayerSelect: () => {},
    onChange: () => {},
    options: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      map: null,
      inspect: null,
    }
  }

  updateMapFromProps(props) {
    if(!IS_SUPPORTED) return;

    if(!this.state.map) return

    //Maplibre GL now does diffing natively so we don't need to calculate
    //the necessary operations ourselves!
    this.state.map.setStyle(
      this.props.replaceAccessTokens(props.mapStyle),
      {diff: true}
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    let should = false;
    try {
      should = JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);
    } catch(e) {
      // no biggie, carry on
    }
    return should;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(!IS_SUPPORTED) return;

    const map = this.state.map;

    this.updateMapFromProps(this.props);

    if(this.state.inspect && this.props.inspectModeEnabled !== this.state.inspect._showInspectMap) {
      // HACK: Fix for <https://github.com/maputnik/editor/issues/576>, while we wait for a proper fix.
      // eslint-disable-next-line
      this.state.inspect._popupBlocked = false;
      this.state.inspect.toggleInspector()
    }
    if (map) {
      if (this.props.inspectModeEnabled) {
        // HACK: We need to work out why we need to do this and what's causing
        // this error. I'm assuming an issue with maplibre-gl update and
        // mapbox-gl-inspect.
        try {
          this.state.inspect.render();
        } catch(err) {
          console.error("FIXME: Caught error", err);
        }
      }

      map.showTileBoundaries = this.props.options.showTileBoundaries;
      map.showCollisionBoxes = this.props.options.showCollisionBoxes;
      map.showOverdrawInspector = this.props.options.showOverdrawInspector;
    }
  }

  componentDidMount() {
    if(!IS_SUPPORTED) return;

    const mapOpts = {
      ...this.props.options,
      container: this.container,
      style: this.props.mapStyle,
      hash: true,
      maxZoom: 24
    }

    const map = new MapLibreGl.Map(mapOpts);

    const mapViewChange = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      this.props.onChange({center, zoom});
    }
    mapViewChange();

    map.showTileBoundaries = mapOpts.showTileBoundaries;
    map.showCollisionBoxes = mapOpts.showCollisionBoxes;
    map.showOverdrawInspector = mapOpts.showOverdrawInspector;

    const zoomControl = new ZoomControl;
    map.addControl(zoomControl, 'top-right');

    const nav = new MapLibreGl.NavigationControl({visualizePitch:true});
    map.addControl(nav, 'top-right');

    const tmpNode = document.createElement('div');

    const inspect = new MapboxInspect({
      popup: new MapLibreGl.Popup({
        closeOnClick: false
      }),
      showMapPopup: true,
      showMapPopupOnHover: false,
      showInspectMapPopupOnHover: true,
      showInspectButton: false,
      blockHoverPopupOnClick: true,
      assignLayerColor: (layerId, alpha) => {
        return Color(colors.brightColor(layerId, alpha)).desaturate(0.5).string()
      },
      buildInspectStyle: (originalMapStyle, coloredLayers) => buildInspectStyle(originalMapStyle, coloredLayers, this.props.highlightedLayer),
      renderPopup: features => {
        if(this.props.inspectModeEnabled) {
          return renderPopup(<MapMaplibreGlFeaturePropertyPopup features={features} />, tmpNode);
        } else {
          return renderPopup(<MapMaplibreGlLayerPopup features={features} onLayerSelect={this.onLayerSelectById} zoom={this.state.zoom} />, tmpNode);
        }
      }
    })
    map.addControl(inspect)

    map.on("style.load", () => {
      this.setState({
        map,
        inspect,
        zoom: map.getZoom()
      });
    })

    map.on("data", e => {
      if(e.dataType !== 'tile') return
      this.props.onDataChange({
        map: this.state.map
      })
    })

    map.on("error", e => {
      console.log("ERROR", e);
    })

    map.on("zoom", e => {
      this.setState({
        zoom: map.getZoom()
      });
    });

    map.on("dragend", mapViewChange);
    map.on("zoomend", mapViewChange);
  }

  onLayerSelectById = (id) => {
    const index = this.props.mapStyle.layers.findIndex(layer => layer.id === id);
    this.props.onLayerSelect(index);
  }

  render() {
    if(IS_SUPPORTED) {
      return <div
        className="maputnik-map__map"
        role="region"
        aria-label="Map view"
        ref={x => this.container = x}
      ></div>
    }
    else {
      return <div
        className="maputnik-map maputnik-map--error"
      >
        <div className="maputnik-map__error-message">
          Error: Cannot load MaplibreGL, WebGL is either unsupported or disabled
        </div>
      </div>
    }
  }
}

