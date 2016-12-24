import React from 'react'
import MapboxGl from 'mapbox-gl'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'
import style from '../../libs/style.js'
import 'mapbox-gl/dist/mapbox-gl.css'

export default class MapboxGlMap extends React.Component {
  static propTypes = {
    onDataChange: React.PropTypes.func,
    mapStyle: React.PropTypes.object.isRequired,
    accessToken: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  static defaultProps = {
    onMapLoaded: () => {},
    onDataChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = { map: null }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.state.map) return

    //Mapbox GL now does diffing natively so we don't need to calculate
    //the necessary operations ourselves!
    this.state.map.setStyle(nextProps.mapStyle, { diff: true})
  }

  componentDidMount() {
    MapboxGl.accessToken = this.props.accessToken

    const map = new MapboxGl.Map({
      container: this.container,
      style: this.props.mapStyle,
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
