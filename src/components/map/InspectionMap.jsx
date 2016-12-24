import React from 'react'
import ReactDOM from 'react-dom'
import MapboxGl from 'mapbox-gl'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'
import colors from '../../config/colors'
import style from '../../libs/style'
import FeaturePropertyTable from './FeaturePropertyTable'
import { generateColoredLayers } from '../../libs/stylegen'
import 'mapbox-gl/dist/mapbox-gl.css'

function convertInspectStyle(mapStyle, sources) {
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
      ...generateColoredLayers(sources),
    ]
  }
  return newStyle
}

function renderFeaturePropertyTable(feature) {
  var mountNode = document.createElement('div');
  ReactDOM.render(<FeaturePropertyTable feature={feature} />, mountNode);
  return mountNode.innerHTML;
}

export default class InspectionMap extends React.Component {
  static propTypes = {
    onDataChange: React.PropTypes.func,
    sources: React.PropTypes.object,
    originalStyle: React.PropTypes.object,
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

    this.state.map.setStyle(convertInspectStyle(nextProps.mapStyle, this.props.sources), { diff: true})
  }

  componentDidMount() {
    MapboxGl.accessToken = this.props.accessToken

    const map = new MapboxGl.Map({
      container: this.container,
      style: convertInspectStyle(this.props.mapStyle, this.props.sources),
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

    map.on('click', this.displayPopup.bind(this));
  }

  displayPopup(e) {
		const features = this.state.map.queryRenderedFeatures(e.point, {
			layers: this.layers
		});

		if (!features.length) {
			return
		}
		const feature = features[0]

/*
		const clickEvent = e.originalEvent
		const x = clickEvent.pageX
		const y = clickEvent.pageY

		console.log(e)
		console.log('Show feature', feature)
*/
		// Populate the popup and set its coordinates
		// based on the feature found.
		const popup = new MapboxGl.Popup()
			.setLngLat(e.lngLat)
			.setHTML(renderFeaturePropertyTable(feature))
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
