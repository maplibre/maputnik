import stylegen from 'mapbox-gl-inspect/lib/stylegen'
import colors from 'mapbox-gl-inspect/lib/colors'

export function colorHighlightedLayer(layer) {
  if(!layer || layer.type === 'background' || layer.type === 'raster') return null

  function changeLayer(l) {
    if(l.type === 'circle') {
      l.paint['circle-radius'] = 3
    } else if(l.type === 'line') {
      l.paint['line-width'] = 2
    }

    if(layer.filter) {
      l.filter = layer.filter
    } else {
      delete l['filter']
    }
    l.id = l.id + '_highlight'
    return l
  }

  const sourceLayerId = layer['source-layer'] || ''
  const color = colors.brightColor(sourceLayerId, 1)
  const layers = []

  if(layer.type === "fill" || layer.type === 'fill-extrusion') {
    return changeLayer(stylegen.polygonLayer(color, color, layer.source, layer['source-layer']))
  }

  if(layer.type === "symbol" || layer.type === 'circle') {
    return changeLayer(stylegen.circleLayer(color, layer.source, layer['source-layer']))
  }

  if(layer.type === 'line') {
    return changeLayer(stylegen.lineLayer(color, layer.source, layer['source-layer']))
  }

  return null
}
