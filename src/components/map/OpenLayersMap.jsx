import React from 'react'
import {throttle} from 'lodash';
import PropTypes from 'prop-types'
import { loadJSON } from '../../libs/urlopen'

import FeatureLayerPopup from './FeatureLayerPopup';

import 'ol/ol.css'
import {apply} from 'ol-mapbox-style';
import {Map, View, Proj, Overlay} from 'ol';

import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection, toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';

// Register some projections...
proj4.defs([
  [
    'EPSG:3031',
    '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs '
  ],
  [
    'EPSG:102003',
    '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=37.5 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs'
  ]
]);
register(proj4);


function renderCoords (coords) {
  if (!coords || coords.length < 2) {
    return null;
  }
  else {
    return <span className="maputnik-coords">
      {coords.map((coord) => String(coord).padStart(7, "\u00A0")).join(', ')}
    </span>
  }
}

export default class OpenLayersMap extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func,
    mapStyle: PropTypes.object.isRequired,
    accessToken: PropTypes.string,
    style: PropTypes.object,
    onLayerSelect: PropTypes.func.isRequired,
    debugToolbox: PropTypes.bool.isRequired,
    projectionCode: PropTypes.string,
  }

  static defaultProps = {
    onMapLoaded: () => {},
    onDataChange: () => {},
    onLayerSelect: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      zoom: 0,
      rotation: 0,
      cursor: [],
      center: [],
    };
    this.updateStyle = throttle(this._updateStyle.bind(this), 200);
  }

  _updateStyle(newMapStyle) {
    if(!this.map) return;

    // Add projection into the style sources.
    const newSources = {};
    Object.keys(newMapStyle.sources).forEach(key => {
      newSources[key] = {
        ...newMapStyle.sources[key],
        projection: this.props.projectionCode,
      }
    })

    // See <https://github.com/openlayers/ol-mapbox-style/issues/215#issuecomment-493198815>
    this.map.getLayers().clear();
    apply(this.map, {
      ...newMapStyle,
      sources: newSources,
    });
  }

  updateProjection () {
    this.projection = getProjection(this.props.projectionCode || "EPSG:3857");
    console.log("SETTING PROJECTION TO", this.props.projectionCode);
  }

  componentDidUpdate(prevProps) {
    if (this.props.projectionCode !== prevProps.projectionCode) {
      this.updateProjection();
      this.map.setView(
        new View({
          projection: this.projection,
          zoom: 1,
          center: [180, -90]
        })
      );
    }
    if (this.props.mapStyle !== prevProps.mapStyle) {
      this.updateStyle(this.props.mapStyle);
    }
  }

  componentDidMount() {
    this.overlay = new Overlay({
      element: this.popupContainer,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.updateProjection();

    const map = new Map({
      target: this.container,
      overlays: [this.overlay],
      view: new View({
        projection: this.projection,
        zoom: 1,
        center: [180, -90],
      })
    });

    // For debugging...
    window.map = map;

    map.on('pointermove', (evt) => {
      var coords = toLonLat(evt.coordinate, this.projection);
      this.setState({
        cursor: [
          coords[0].toFixed(2),
          coords[1].toFixed(2)
        ]
      })
    })

    map.on('postrender', (evt) => {
      const center = toLonLat(map.getView().getCenter(), this.projection);
      this.setState({
        center: [
          center[0].toFixed(2),
          center[1].toFixed(2),
        ],
        rotation: map.getView().getRotation().toFixed(2),
        zoom: map.getView().getZoom().toFixed(2)
      });
    });


    map.on('singleclick', (evt) => {
      this.overlay.setPosition(undefined);

      const features = [];
      map.forEachLayerAtPixel(evt.pixel, (layer) => {
        // FIXME: This is a HACK
        layer.values_['mapbox-layers'].forEach((id) => {
          features.push({
            layer: {
              id,
              'source-layer': layer.values_['mapbox-source']
            }
          });
        })
      });

      this.setState({
        selectedFeatures: features,
      });

      if (features.length > 0) {
        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));
        this.overlay.setPosition(coordinate);
      }
    });

    this.map = map;
    this.updateStyle(this.props.mapStyle);
  }

  closeOverlay = (e) => {
    e.target.blur();
    this.overlay.setPosition(undefined);
  }

  render() {
    return <div className="maputnik-ol-container">
      <div
        ref={x => this.popupContainer = x}
        style={{background: "black"}}
        className="maputnik-popup"
      >
        <button
          className="mapboxgl-popup-close-button"
          onClick={this.closeOverlay}
          aria-label="Close popup"
        >
          ×
        </button>
        <FeatureLayerPopup
          features={this.state.selectedFeatures || []}
          onLayerSelect={this.props.onLayerSelect}
        />
      </div>
      <div className="maputnik-ol-zoom">
        Zoom level: {this.state.zoom}
      </div>
      {this.props.debugToolbox &&
        <div className="maputnik-ol-debug">
          <div>
            <label>cursor: </label>
            <span>{renderCoords(this.state.cursor)}</span>
          </div>
          <div>
            <label>center: </label>
            <span>{renderCoords(this.state.center)}</span>
          </div>
          <div>
            <label>rotation: </label>
            <span>{this.state.rotation}</span>
          </div>
        </div>
      }
      <div
        className="maputnik-ol"
        ref={x => this.container = x}
        style={{
          ...this.props.style,
        }}>
      </div>
    </div>
  }
}

