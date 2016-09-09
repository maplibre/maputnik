import React from 'react';
import randomColor from 'randomcolor'

export function colorizeLayers(layers) {
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
