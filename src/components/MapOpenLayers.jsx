import React from 'react'
import {throttle} from 'lodash';
import PropTypes from 'prop-types'
import { loadJSON } from '../libs/urlopen'

import MapMapboxGlLayerPopup from './MapMapboxGlLayerPopup';

import 'ol/ol.css'
import {apply} from 'ol-mapbox-style';
import {Map, View, Proj, Overlay} from 'ol';

import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';


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

export default class MapOpenLayers extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func,
    mapStyle: PropTypes.object.isRequired,
    accessToken: PropTypes.string,
    style: PropTypes.object,
    onLayerSelect: PropTypes.func.isRequired,
    debugToolbox: PropTypes.bool.isRequired,
    replaceAccessTokens: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
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

    // See <https://github.com/openlayers/ol-mapbox-style/issues/215#issuecomment-493198815>
    this.map.getLayers().clear();
    apply(this.map, newMapStyle);
  }

  componentDidUpdate(prevProps) {
    if (this.props.mapStyle !== prevProps.mapStyle) {
      this.updateStyle(
        this.props.replaceAccessTokens(this.props.mapStyle)
      );
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

    const map = new Map({
      target: this.container,
      overlays: [this.overlay],
      view: new View({
        zoom: 1,
        center: [180, -90],
      })
    });

    map.on('pointermove', (evt) => {
      var coords = toLonLat(evt.coordinate);
      this.setState({
        cursor: [
          coords[0].toFixed(2),
          coords[1].toFixed(2)
        ]
      })
    })

    const onMoveEnd = () => {
      const zoom = map.getView().getZoom();
      const center = toLonLat(map.getView().getCenter());

      this.props.onChange({
        zoom,
        center: {
          lng: center[0],
          lat: center[1],
        },
      });
    }

    onMoveEnd();
    map.on('moveend', onMoveEnd);

    map.on('postrender', (evt) => {
      const center = toLonLat(map.getView().getCenter());
      this.setState({
        center: [
          center[0].toFixed(2),
          center[1].toFixed(2),
        ],
        rotation: map.getView().getRotation().toFixed(2),
        zoom: map.getView().getZoom().toFixed(2)
      });
    });



    this.map = map;
    this.updateStyle(
      this.props.replaceAccessTokens(this.props.mapStyle)
    );
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
        <MapMapboxGlLayerPopup
          features={this.state.selectedFeatures || []}
          onLayerSelect={this.props.onLayerSelect}
        />
      </div>
      <div className="maputnik-ol-zoom">
        Zoom: {this.state.zoom}
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
        role="region"
        aria-label="Map view"
        style={{
          ...this.props.style,
        }}>
      </div>
    </div>
  }
}

