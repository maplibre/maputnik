import React from 'react'
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl"

import theme from './theme.js'

export class Map extends React.Component {
	constructor(props) {
			super(props)
	}

	render() {
		if (this.props.mapStyle) {
			return <ReactMapboxGl
					style={this.props.mapStyle}
					accessToken="pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w">
					<ZoomControl/>
			</ReactMapboxGl>
		}
		return <div style={{backgroundColor: theme.colors.black}}/>
	}
}

