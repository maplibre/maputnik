import React from 'react'
import MapboxGl from 'mapbox-gl'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'
import colors from '../../config/colors'
import style from '../../libs/style'
import { generateColoredLayers } from '../../libs/stylegen'

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

export default class InspectionMap extends React.Component {
  static propTypes = {
    onDataChange: React.PropTypes.func,
    sources: React.PropTypes.object,
    originalStyle: React.PropTypes.object,
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
    }}></div>
  }
}
