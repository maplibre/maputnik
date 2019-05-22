import React from 'react'
import {throttle} from 'lodash';
import PropTypes from 'prop-types'
import { loadJSON } from '../../libs/urlopen'

import 'ol/ol.css'
import {apply} from 'ol-mapbox-style';
import {Map, View} from 'ol';


export default class OpenLayersMap extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func,
    mapStyle: PropTypes.object.isRequired,
    accessToken: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    onMapLoaded: () => {},
    onDataChange: () => {},
  }

  constructor(props) {
    super(props);
    this.updateStyle = throttle(this._updateStyle.bind(this), 200);
  }

  _updateStyle(newMapStyle) {
    if(!this.map) return;

    // See <https://github.com/openlayers/ol-mapbox-style/issues/215#issuecomment-493198815>
    this.map.getLayers().clear();
    apply(this.map, newMapStyle);
  }

  componentDidUpdate() {
    this.updateStyle(this.props.mapStyle);
  }

  componentDidMount() {
    this.updateStyle(this.props.mapStyle);

    const map = new Map({
      target: this.container,
      layers: [],
      view: new View({
        zoom: 2,
        center: [52.5, -78.4]
      })
    })
    this.map = map;
  }

  render() {
    return <div
      ref={x => this.container = x}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: '#fff',
        ...this.props.style,
      }}>
    </div>
  }
}

