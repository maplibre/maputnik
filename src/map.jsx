import React from 'react'
import ReactMapboxGl from "react-mapbox-gl"

export class Map extends React.Component {
	constructor(props) {
			super(props)
	}

	render() {
		if (this.props.mapStyle) {
			return <ReactMapboxGl
				style={this.props.mapStyle}
				accessToken="pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w"/>
	}
		return <div />
	}
}

