import React from 'react';
import Immutable from 'immutable'
import spec from 'mapbox-gl-style-spec/reference/latest.min.js'
import diffJSONStyles from 'mapbox-gl-style-spec/lib/diff'
import randomColor from 'randomcolor'

// Standard JSON to Immutable conversion except layers
// are stored in an OrderedMap to make lookups id fast
// It also ensures that every style has an id and
// a created date for future reference
function fromJSON(jsonStyle) {
	if (typeof jsonStyle === 'string' || jsonStyle instanceof String) {
		jsonStyle = JSON.parse(jsonStyle)
	}

	return Immutable.Map(Object.keys(jsonStyle).map(key => {
		const val = jsonStyle[key]
		if(key === "layers") {
			return [key, Immutable.OrderedMap(val.map(l => [l.id, Immutable.fromJS(l)]))]
		} else if(key === "sources" || key === "metadata" || key === "transition") {
			return [key, Immutable.fromJS(val)]
		} else {
			return [key, val]
		}
	}))
}

function ensureHasId(style) {
	if(style.has('id')) return style
	return style.set('id', Math.random().toString(36).substr(2, 9))
}

function ensureHasTimestamp(style) {
	if(style.has('id')) return style
	return style.set('created', new Date().toJSON())
}

function ensureMetadataExists(style) {
	return ensureHasId(ensureHasTimestamp(style))
}

// Compare style with other style and return changes
//TODO: Write own diff algo that operates on immutable collections
// Should be able to improve performance since we can only compare
// by reference
function diffStyles(before, after) {
	return diffJSONStyles(toJSON(before), toJSON(after))
}

// Turns immutable style back into JSON with the original order of the
// layers preserved
function toJSON(mapStyle) {
	const jsonStyle = {}
	for(let [key, value] of mapStyle.entries()) {
		if(key === "layers") {
			jsonStyle[key] = value.toIndexedSeq().toJS()
		} else if(key === 'sources' || key === "metadata" || key === "transition") {
			jsonStyle[key] = value.toJS()
		} else {
			jsonStyle[key] = value
		}
	}
	return jsonStyle
}

export function colorizeLayers(layers) {
	return layers.map(layer => {
		if(!layer.metadata) {
			layer.metadata = {}
		}
		if(!"maputnik:color" in layer.metadata) {
			layer.metadata["maputnik:color"] = randomColor()
		}
	  return layer
	})
}

export default {
	colorizeLayers,
	toJSON,
	fromJSON,
	diffStyles,
	ensureMetadataExists,
}
