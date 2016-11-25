import React from 'react'
import MapboxGl from 'mapbox-gl';
import { fullHeight } from './theme.js'
import style from './style.js'
import Immutable from 'immutable'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'
import ol from 'openlayers'
import olms from 'ol-mapbox-style'

export class Map extends React.Component {
	static propTypes = {
		mapStyle: React.PropTypes.instanceOf(Immutable.Map).isRequired,
		accessToken: React.PropTypes.string,
	}

	shouldComponentUpdate(nextProps, nextState) {
		//TODO: If we enable this React mixin for immutable comparison we can remove this?
		return nextProps.mapStyle !== this.props.mapStyle
	}

	render() {
		return <div
		ref={x => this.container = x}
		style={{
			...fullHeight,
			width: "100%",
		}}></div>
	}
}

export class MapboxGlMap extends Map {
	componentWillReceiveProps(nextProps) {
		const tokenChanged = nextProps.accessToken !== MapboxGl.accessToken

		// If the id has changed a new style has been uplaoded and
		// it is safer to do a full new render
		// TODO: might already be handled in diff algorithm?
		const mapIdChanged = this.props.mapStyle.get('id') !== nextProps.mapStyle.get('id')

		if(mapIdChanged || tokenChanged) {
			this.state.map.setStyle(style.toJSON(nextProps.mapStyle))
			return
		}

		// TODO: If there is no map yet we need to apply the changes later?
		if(this.state.map) {
			style.diffStyles(this.props.mapStyle, nextProps.mapStyle).forEach(change => {

				//TODO: Invalid outline color can cause map to freeze?
				if(change.command === "setPaintProperty" && change.args[1] === "fill-outline-color" ) {
					const value = change.args[2]
					if(validateColor({value}).length > 0) {
						return
					}
				}

				console.log(change.command, ...change.args)
				this.state.map[change.command].apply(this.state.map, change.args);
			});
		}
	}

	componentDidMount() {
		MapboxGl.accessToken = this.props.accessToken

		const map = new MapboxGl.Map({
			container: this.container,
			style: style.toJSON(this.props.mapStyle),
		});

		map.on("style.load", (...args) => {
			this.setState({ map });
		});
  }
}

export class OpenLayer3Map extends Map {
	constructor(props) {
		super(props)

		const tilegrid = ol.tilegrid.createXYZ({tileSize: 512, maxZoom: 22})
		this.resolutions = tilegrid.getResolutions()
		this.layer = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
					'© <a href="http://www.openstreetmap.org/copyright">' +
					'OpenStreetMap contributors</a>',
				format: new ol.format.MVT(),
				tileGrid: tilegrid,
				tilePixelRatio: 8,
				url: 'http://osm2vectortiles-0.tileserver.com/v2/{z}/{x}/{y}.pbf'
			})
		})
	}

	componentWillReceiveProps(nextProps) {
		const jsonStyle = style.toJSON(nextProps.mapStyle)
		const styleFunc = olms.getStyleFunction(jsonStyle, 'mapbox', this.resolutions)
		this.layer.setStyle(styleFunc)
		this.state.map.render()
	}


	componentDidMount() {
		const styleFunc = olms.getStyleFunction(style.toJSON(this.props.mapStyle), 'mapbox', this.resolutions)
		this.layer.setStyle(styleFunc)

		const map = new ol.Map({
		target: this.container,
			layers: [this.layer],
			view: new ol.View({
				center: [949282, 6002552],
				zoom: 4
			})
		})
		this.setState({ map });
	}
}
