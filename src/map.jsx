import React from 'react'
import MapboxGl from 'mapbox-gl';
import diffStyles from 'mapbox-gl-style-spec/lib/diff'
import theme from './theme.js'
import Immutable from 'immutable'

export class Map extends React.Component {
	static propTypes = {
		mapStyle: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	componentWillReceiveProps(nextProps) {
		// If the id has changed a new style has been uplaoded and
		// it is safer to do a full new render
		const mapIdChanged = this.props.mapStyle.get('id') !== nextProps.mapStyle.get('id')
		if(mapIdChanged) {
			this.state.map.setStyle(nextProps.mapStyle.toJS())
			return
		}

		// TODO: If there is no map yet we need to apply the changes later?
		// How to deal with that?
		if(this.state.map) {
			//TODO: Write own diff algo that operates on immutable collections
			// Should be able to improve performance since we can only compare
			// by reference
			const changes = diffStyles(this.props.mapStyle.toJS(), nextProps.mapStyle.toJS())
			changes.forEach(change => {
				this.state.map[change.command].apply(this.state.map, change.args);
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.mapStyle !== this.props.mapStyle
	}

	componentDidMount() {
		//TODO: Read MapboxGL token from settings
		MapboxGl.accessToken = "pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w";

		const map = new MapboxGl.Map({
			container: this.container,
			style: this.props.mapStyle.toJS(),
		});

		map.on("style.load", (...args) => {
			this.setState({ map });
		});
	}

	render() {
		return <div ref={x => this.container = x}></div>
	}
}
