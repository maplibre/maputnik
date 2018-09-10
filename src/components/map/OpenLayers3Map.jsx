import React from 'react'
import PropTypes from 'prop-types'
import { loadJSON } from '../../libs/urlopen'
import 'ol/ol.css'


class OpenLayers3Map extends React.Component {
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
    super(props)
    this.map = null
  }

  updateStyle(newMapStyle) {
    const olms = require('ol-mapbox-style');
    const styleFunc = olms.apply(this.map, newMapStyle)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    require.ensure(["ol", "ol-mapbox-style"], () => {
      if(!this.map) return
      this.updateStyle(nextProps.mapStyle)
    })
  }

  componentDidMount() {
    //Load OpenLayers dynamically once we need it
    //TODO: Make this more convenient
    require.ensure(["ol", "ol/map", "ol/view", "ol/control/zoom", "ol-mapbox-style"], ()=> {
      console.log('Loaded OpenLayers3 renderer')

      const olMap = require('ol/map').default
      const olView = require('ol/view').default
      const olZoom = require('ol/control/zoom').default

      const map = new olMap({
        target: this.container,
        layers: [],
        view: new olView({
          zoom: 2,
          center: [52.5, -78.4]
        })
      })
      map.addControl(new olZoom())
      this.map = map
      this.updateStyle(this.props.mapStyle)
    })
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

export default OpenLayers3Map
