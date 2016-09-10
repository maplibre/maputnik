import { colorizeLayers } from './style.js'
import Immutable from 'immutable'

const storage = {
	prefix: 'mapolo',
	keys: {
		latest: 'mapolo:latest_style'
	}
}

const emptyStyle = {
		version: 8,
		sources: {},
		layers: [],
}

	// Return style ids and dates of all styles stored in local storage
function loadStoredStyles() {
	const styles = []
	for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)
			if(isStyleKey(key)) {
				styles.push(fromKey(key))
			}
	}
	return styles
}

function isStyleKey(key) {
	const parts = key.split(":")
	return parts.length == 2 && parts[0] === storage.prefix
}

// Load style id from key
function fromKey(key) {
	if(!isStyleKey(key)) {
		throw "Key is not a valid style key"
	}

	const parts = key.split(":")
	const styleId = parts[1]
	return styleId
}

// Calculate key that identifies the style with a version
function styleKey(styleId) {
	return [storage.prefix, styleId].join(":")
}

// Ensure a style has a unique id and a created date
function ensureOptionalStyleProps(mapStyle) {
		if(!('id' in mapStyle)) {
			mapStyle = mapStyle.set('id', Math.random().toString(36).substr(2, 9))
		}
		if(!("created" in mapStyle)) {
			mapStyle = mapStyle.set('created', new Date())
		}
		return mapStyle
}

// Manages many possible styles that are stored in the local storage
export class StyleStore {
	// Tile store will load all items from local storage and
	// assume they do not change will working on it
	constructor() {
		this.mapStyles = loadStoredStyles()
	}

	// Find the last edited style
	latestStyle() {
		if(this.mapStyles.length == 0) {
			return ensureOptionalStyleProps(Immutable.fromJS(emptyStyle))
		}
		const styleId = window.localStorage.getItem(storage.keys.latest)
		const styleItem = window.localStorage.getItem(styleKey(styleId))
		return Immutable.fromJS(JSON.parse(styleItem))
	}

	// Save current style replacing previous version
	save(mapStyle) {
		if(!(mapStyle instanceof Immutable.Map)) {
			mapStyle = Immutable.fromJS(mapStyle)
		}
		mapStyle = ensureOptionalStyleProps(mapStyle)
		const key = styleKey(mapStyle.get('id'))
		window.localStorage.setItem(key, JSON.stringify(mapStyle.toJS()))
		window.localStorage.setItem(storage.keys.latest, mapStyle.get('id'))
		return mapStyle
	}
}
