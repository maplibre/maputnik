import React from 'react';

// A wrapper around Mapbox GL style to publish
// and subscribe to map changes
export class StyleManager {
	constructor(mapStyle) {
		this.commandHistory = [];
		this.subscribers = [];
		this.mapStyle = mapStyle;
	}

	onStyleChange(cb) {
		this.subscribers.push(cb);
	}

	changeStyle(command) {
		this.commandHistory.push(command)
		this.subscribers.forEach(f => f(command))
		console.log(command)
	}

	exportStyle() {
		return JSON.stringify(this.mapStyle, null, 4)
	}

	layer(layerId) {
		console.log(this.mapStyle)
		return this.mapStyle.layers[layerId]
	}

	layers() {
		if(this.mapStyle) return this.mapStyle.layers
		return []
	}
}
