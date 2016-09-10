import React from 'react'
import MapboxGl from 'mapbox-gl';
import diffStyles from 'mapbox-gl-style-spec/lib/diff'
import { fullHeight } from './theme.js'
import { styleToJS } from './stylestore.js'
import Immutable from 'immutable'

export class Map extends React.Component {
	static propTypes = {
		mapStyle: React.PropTypes.instanceOf(Immutable.Map).isRequired,
		accessToken: React.PropTypes.string,
	}

	componentWillReceiveProps(nextProps) {
		const tokenChanged = nextProps.accessToken !== MapboxGl.accessToken

		// If the id has changed a new style has been uplaoded and
		// it is safer to do a full new render
		const mapIdChanged = this.props.mapStyle.get('id') !== nextProps.mapStyle.get('id')

		if(mapIdChanged || tokenChanged) {
			this.state.map.setStyle(styleToJS(nextProps.mapStyle))
			return
		}

		// TODO: If there is no map yet we need to apply the changes later?
		// How to deal with that?
		if(this.state.map) {
			//TODO: Write own diff algo that operates on immutable collections
			// Should be able to improve performance since we can only compare
			// by reference
			const changes = diffStyles(styleToJS(this.props.mapStyle), styleToJS(nextProps.mapStyle))
			changes.forEach(change => {
				this.state.map[change.command].apply(this.state.map, change.args);
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.mapStyle !== this.props.mapStyle
	}

	componentDidMount() {
		MapboxGl.accessToken = this.props.accessToken

		const map = new MapboxGl.Map({
			container: this.container,
			style: styleToJS(this.props.mapStyle),
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
