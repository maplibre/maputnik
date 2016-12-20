import React from 'react';
import Immutable from 'immutable'
import spec from 'mapbox-gl-style-spec/reference/latest.min.js'

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

// Empty style is always used if no style could be restored or fetched
const emptyStyle = ensureMetadataExists(fromJSON({
  version: 8,
  sources: {},
  layers: [],
}))

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

export default {
  toJSON,
  fromJSON,
  ensureMetadataExists,
  emptyStyle,
}
