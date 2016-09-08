import React from 'react';

// A wrapper around Mapbox GL style
export class Style {
	constructor() {
		this.styleHistory = [];
		this.renderers = [];
	}

	load(style) {
		this.currentStyle = style;
	}

	onRender(cb) {
		this.renderers.push(cb);
	}

	update(style) {
		this.styleHistory.push(this.currentStyle);
		this.currentStyle = style;
		this.renderers.forEach(r => r(this.currentStyle))
	}

	layers() {
		return this.currentStyle.layers;
	}
}
