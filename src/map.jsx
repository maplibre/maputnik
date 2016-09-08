import React from 'react';
import MapboxGl from 'mapbox-gl';

export class Map extends React.Component {
	constructor(props) {
			super(props);
	}

	componentDidMount() {
		MapboxGl.accessToken = "pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w";
		const map = new MapboxGl.Map({
			container: this.container,
			style: "mapbox://styles/morgenkaffee/cirqasdb8003dh1ntbo6dkvs6"
		});
	}

	render() {
		return <div ref={x => this.container = x} style={{zIndex: 15}}></div>
	}
}

