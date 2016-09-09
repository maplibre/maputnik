import { colorizeLayers } from './style.js'

const emptyStyle = {
		version: 8,
		sources: {},
		layers: []
}

// Manages many possible styles that are stored in the local storage
export class StyleStore {
	// By default the style store will use the last edited style
	// as current working style if no explicit style is set
	constructor(mapStyle) {
		if(mapStyle) {
				this.load(mapStyle)
		} else {
			try {
				const latestStyle = this.latestStyle()
				console.log("Loading latest stlye " + latestStyle.id + " from " + latestStyle.modified)
				this.load(latestStyle)
			} catch(err) {
				console.log(err)
				this.load(emptyStyle)
			}
		}
	}

	// Find the last edited style
	latestStyle() {
		const styles = this.loadStoredStyles()

		if(styles.length == 0) {
			throw "No existing style found"
		}

		let maxStyle = styles[0]
		styles.forEach(s => {
			if(s.date > maxStyle.date) {
				maxStyle = s
			}
		})

		return JSON.parse(window.localStorage.getItem(this.styleKey(maxStyle.styleId, maxStyle.date)))
	}

	// Return style ids and dates of all styles stored in local storage
	loadStoredStyles() {
		const styles = []
		for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i)
				if(this.isStyleKey(key)) {
					styles.push(this.fromKey(key))
				}
		}
		return styles
	}

	isStyleKey(key) {
		const parts = key.split(":")
		return parts.length >= 3 && parts[0] === "mapolo"
	}

	// Load style from local storage by key
	fromKey(key) {
		if(!this.isStyleKey(key)) {
			throw "Key is not a valid style key"
		}

		const parts = key.split(":")
		const styleId = parts[1]
		const date = new Date(parts.slice(2).join(":"))
		return {styleId, date}
	}

	// Calculate key that identifies the style with a version
	styleKey(styleId, modifiedDate) {
		return ["mapolo", styleId, modifiedDate.toJSON()].join(":")
	}

	// Take snapshot of current style and load it
	backup(mapStyle) {
		mapStyle.modified = new Date()
		const key = this.styleKey(mapStyle.id, mapStyle.modified)
		window.localStorage.setItem(key, JSON.stringify(mapStyle))
	}

	// Load a style from external into the store
	// replacing the previous version
	load(mapStyle) {
		if(!("id" in mapStyle)) {
			mapStyle.id = Math.random().toString(36).substr(2, 9)
		}
		if(!("created" in mapStyle)) {
			mapStyle.created = new Date()
		}
		mapStyle.layers = colorizeLayers(mapStyle.layers)

		this.backup(mapStyle)
		this.currentStyle = mapStyle
	}
}
