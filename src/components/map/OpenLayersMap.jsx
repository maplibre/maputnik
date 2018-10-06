import React from 'react'
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
  }

  updateStyle(newMapStyle) {
    if(!this.map) return;
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
        position: "fixed",
        top: 40,
        right: 0,
        bottom: 0,
        height: 'calc(100% - 40px)',
        width: "75%",
        backgroundColor: '#fff',
        ...this.props.style,
      }}>
    </div>
  }
}

