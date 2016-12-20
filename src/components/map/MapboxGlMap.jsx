import React from 'react'
import MapboxGl from 'mapbox-gl'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'

import Map from './Map.jsx'
import style from '../../libs/style.js'

export default class MapboxGlMap extends Map {
  static propTypes = {
    onMapLoaded: React.PropTypes.func,
  }

  static defaultProps = {
    onMapLoaded: () => {}
  }

  constructor(props) {
    super(props)
    this.state = { map: null }
  }
  componentWillReceiveProps(nextProps) {
    if(!this.state.map) return

    //Mapbox GL now does diffing natively so we don't need to calculate
    //the necessary operations ourselves!
    this.state.map.setStyle(style.toJSON(nextProps.mapStyle), { diff: true})
  }

  componentDidMount() {
    MapboxGl.accessToken = this.props.accessToken

    const map = new MapboxGl.Map({
      container: this.container,
      style: style.toJSON(this.props.mapStyle),
    });

    map.on("style.load", (...args) => {
      this.props.onMapLoaded(map)
      this.setState({ map });
    });
  }
}
