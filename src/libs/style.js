import React from 'react';
import spec from 'mapbox-gl-style-spec/reference/latest.min.js'

// Empty style is always used if no style could be restored or fetched
const emptyStyle = ensureMetadataExists({
  version: 8,
  sources: {},
  layers: [],
})

function ensureHasId(style) {
  if('id' in style) return style
  style.id = Math.random().toString(36).substr(2, 9)
  return style
}

function ensureHasTimestamp(style) {
  if('created' in style) return style
  style.created = new Date().toJSON()
  return style
}

function ensureMetadataExists(style) {
  return ensureHasId(ensureHasTimestamp(style))
}

export default {
  ensureMetadataExists,
  emptyStyle,
}
