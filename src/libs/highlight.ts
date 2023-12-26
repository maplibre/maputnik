// @ts-ignore
import stylegen from 'mapbox-gl-inspect/lib/stylegen'
// @ts-ignore
import colors from 'mapbox-gl-inspect/lib/colors'
import type {FilterSpecification,LayerSpecification } from 'maplibre-gl'

export type HighlightedLayer = LayerSpecification & {filter?: FilterSpecification};

function changeLayer(l: HighlightedLayer, layer: LayerSpecification) {
  if(l.type === 'circle') {
    l.paint!['circle-radius'] = 3
  } else if(l.type === 'line') {
    l.paint!['line-width'] = 2
  }

  if("filter" in layer) {
    l.filter = layer.filter
  } else {
    delete l['filter']
  }
  l.id = l.id + '_highlight'
  return l
}

export function colorHighlightedLayer(layer?: LayerSpecification): HighlightedLayer | null {
  if(!layer || layer.type === 'background' || layer.type === 'raster') return null

  const sourceLayerId = layer['source-layer'] || ''
  const color = colors.brightColor(sourceLayerId, 1);

  if(layer.type === "fill" || layer.type === 'fill-extrusion') {
    return changeLayer(stylegen.polygonLayer(color, color, layer.source, layer['source-layer']), layer)
  }

  if(layer.type === "symbol" || layer.type === 'circle') {
    return changeLayer(stylegen.circleLayer(color, layer.source, layer['source-layer']), layer)
  }

  if(layer.type === 'line') {
    return changeLayer(stylegen.lineLayer(color, layer.source, layer['source-layer']), layer)
  }

  return null
}
