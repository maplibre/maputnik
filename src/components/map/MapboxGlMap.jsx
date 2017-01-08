import React from 'react'
import ReactDOM from 'react-dom'
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'
import MapboxInspect from 'mapbox-gl-inspect'
import FeatureLayerTable from './FeatureLayerTable'
import FeaturePropertyPopup from './FeaturePropertyPopup'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'
import style from '../../libs/style.js'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../../mapboxgl.css'

function renderLayerPopup(features) {
  var mountNode = document.createElement('div');
  ReactDOM.render(<FeatureLayerTable features={features} />, mountNode)
  return mountNode.innerHTML;
}

function renderPropertyPopup(features) {
  var mountNode = document.createElement('div');
  ReactDOM.render(<FeaturePropertyPopup features={features} />, mountNode)
  return mountNode.innerHTML;
}

export default class MapboxGlMap extends React.Component {
  static propTypes = {
    onDataChange: React.PropTypes.func,
    mapStyle: React.PropTypes.object.isRequired,
    accessToken: React.PropTypes.string,
    style: React.PropTypes.object,
    inspectModeEnabled: React.PropTypes.bool.isRequired,
  }

  static defaultProps = {
    onMapLoaded: () => {},
    onDataChange: () => {},
  }

  constructor(props) {
    super(props)
    MapboxGl.accessToken = props.accessToken
    this.state = {
      map: null,
      isPopupOpen: false,
      popupX: 0,
      popupY: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    MapboxGl.accessToken = nextProps.accessToken

    if(!this.state.map) return

    if(!this.props.inspectModeEnabled) {
      //Mapbox GL now does diffing natively so we don't need to calculate
      //the necessary operations ourselves!
      this.state.map.setStyle(nextProps.mapStyle, { diff: true})
    }

    if(this.props.inspectModeEnabled !== nextProps.inspectModeEnabled) {
      this.inspect.toggleInspector()
    }
  }

  componentDidMount() {
    const map = new MapboxGl.Map({
      container: this.container,
      style: this.props.mapStyle,
      hash: true,
    })

		const nav = new MapboxGl.NavigationControl();
		map.addControl(nav, 'top-right');

    this.inspect = new MapboxInspect({
      popup: new MapboxGl.Popup({
        closeButton: false,
        closeOnClick: false
      }),
      showInspectButton: false,
      renderPopup: features => {
        if(this.props.inspectModeEnabled) {
          return renderPropertyPopup(features)
        } else {
          return renderLayerPopup(features)
        }
      }
    })
		map.addControl(this.inspect)

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
        right: 0,
        bottom: 0,
        height: "100%",
        width: "75%",
        ...this.props.style,
      }}>
    </div>
  }
}
