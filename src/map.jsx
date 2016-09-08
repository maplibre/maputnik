import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import {ZoomControl} from 'react-mapbox-gl';


export class Map extends React.Component {
    constructor(props) {
			super(props);
    }
	render() {
		return <ReactMapboxGl
      style="mapbox://styles/morgenkaffee/ciqo4gtwo0037c0m7tpcosu63"
      accessToken="pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w"
		 ><ZoomControl /></ReactMapboxGl>
	}
}

