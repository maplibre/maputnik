import React from 'react'
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl"

import theme from './theme.js'

export class Map extends React.Component {
	static propTypes = {
    mapStyle: React.PropTypes.object.isRequired
  }

	render() {
		return <ReactMapboxGl
				style={this.props.mapStyle}
				accessToken="pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w">
				<ZoomControl/>
		</ReactMapboxGl>
	}
}
