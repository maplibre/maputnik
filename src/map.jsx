import React from 'react'
import MapboxGl from 'mapbox-gl';
import { fullHeight } from './theme.js'
import style from './style.js'
import Immutable from 'immutable'
import validateColor from 'mapbox-gl-style-spec/lib/validate/validate_color'

export class Map extends React.Component {
	static propTypes = {
		mapStyle: React.PropTypes.instanceOf(Immutable.Map).isRequired,
		accessToken: React.PropTypes.string,
	}

	componentWillReceiveProps(nextProps) {
		const hasTokenChanged = nextProps.accessToken !== MapboxGl.accessToken
    MapboxGl.accessToken = nextProps.accessToken

		// If the id has changed a new style has been uplaoded and
		// it is safer to do a full new render
		// TODO: might already be handled in diff algorithm?
		const mapIdChanged = this.props.mapStyle.get('id') !== nextProps.mapStyle.get('id')

		if(mapIdChanged || hasTokenChanged) {
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

	shouldComponentUpdate(nextProps, nextState) {
		//TODO: If we enable this React mixin for immutable comparison we can remove this?
		return nextProps.mapStyle !== this.props.mapStyle
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

	render() {
			return <div
				ref={x => this.container = x}
				style={{
					...fullHeight,
					width: "100%",
				}}></div>
	}
}
