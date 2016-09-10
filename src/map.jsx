import React from 'react'
import MapboxGl from 'mapbox-gl';
import diffStyles from 'mapbox-gl-style-spec/lib/diff'
import theme from './theme.js'

export class Map extends React.Component {
	static propTypes = {
    mapStyle: React.PropTypes.object.isRequired
  }

	componentWillReceiveProps(nextProps) {
		const map = this.state.map
		if(map) {
			const changes = diffStyles(this.props.mapStyle.toJS(), nextProps.mapStyle.toJS())
			changes.forEach(change => {
				map[change.command].apply(map, change.args);
			});
		}
	}

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.mapStyle !== this.props.mapStyle
  }

	componentDidMount() {
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
