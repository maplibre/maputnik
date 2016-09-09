import React from 'react';
import randomColor from 'randomcolor'

function assignColorsToLayers(layers) {
	return layers.map(layer => {
		if(!layer.metadata) {
			layer.metadata = {}
		}
		if(!"mapolo:color" in layer.metadata) {
			layer.metadata["mapolo:color"] = randomColor()
		}
	  return layer
	})
}

// A wrapper around Mapbox GL style to publish
// and subscribe to map changes
export class StyleManager {
	constructor(mapStyle) {
		this.commandHistory = [];
		this.subscribers = [];
		this.mapStyle = mapStyle;

		if(this.mapStyle) {
			this.mapStyle.layers = assignColorsToLayers(this.mapStyle.layers)
		}
	}

	onStyleChange(cb) {
		this.subscribers.push(cb);
	}

	changeStyle(change) {
		this.commandHistory.push(change)
		this.subscribers.forEach(f => f(change))
		console.log(change)
	}

	exportStyle() {
		return JSON.stringify(this.mapStyle, null, 4)
	}

	settings() {
		const { name, sprite, glyphs, owner } = this.mapStyle
		return { name, sprite, glyphs, owner }
	}

	set name(val) {
	    this.mapStyle.name = val
	}

	set owner(val) {
	    this.mapStyle.owner = val
	}

	set glyphs(val) {
	    this.mapStyle.glyphs = val
			this.changeStyle({
				command: 'setStyle',
				args: [this.mapStyle]
			})
	}

	set sprite(val) {
	    this.mapStyle.sprite = val
			this.changeStyle({
				command: 'setStyle',
				args: [this.mapStyle]
			})
	}

	layer(layerId) {
		return this.mapStyle.layers[layerId]
	}

	layers() {
		if(this.mapStyle) return this.mapStyle.layers
		return []
	}
}
