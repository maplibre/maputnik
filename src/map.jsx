import React from 'react'
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl"

import theme from './theme.js'

export class Map extends React.Component {
	static propTypes = {
    styleManager: React.PropTypes.object.isRequired
  }

	constructor(props) {
		super(props)
		this.map = null
	}

	onStyleChange(change) {
		this.map[change.command].apply(this.map, change.args);
	}

	onMapLoaded(map) {
		this.map = map;
		this.props.styleManager.onStyleChange(this.onStyleChange.bind(this))
	}

	render() {
		if (this.props.styleManager.mapStyle) {
			return <ReactMapboxGl
					onStyleLoad={this.onMapLoaded.bind(this)}
					style={this.props.styleManager.mapStyle}
					accessToken="pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w">
					<ZoomControl/>
			</ReactMapboxGl>
		}
		return <div style={{backgroundColor: theme.colors.black}}/>
	}
}
