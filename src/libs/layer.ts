import {latest} from '@maplibre/maplibre-gl-style-spec'
import { LayerSpecification } from 'maplibre-gl'

export function changeType(layer: LayerSpecification, newType: string) {
  const changedPaintProps: LayerSpecification["paint"] = { ...layer.paint }
  Object.keys(changedPaintProps).forEach(propertyName => {
    if(!(propertyName in latest['paint_' + newType])) {
      delete changedPaintProps[propertyName as keyof LayerSpecification["paint"]]
    }
  })

  const changedLayoutProps: LayerSpecification["layout"] = { ...layer.layout }
  Object.keys(changedLayoutProps).forEach(propertyName => {
    if(!(propertyName in latest['layout_' + newType])) {
      delete changedLayoutProps[propertyName as keyof LayerSpecification["layout"]]
    }
  })

  return {
    ...layer,
    paint: changedPaintProps,
    layout: changedLayoutProps,
    type: newType,
  }
}

/** A {@property} in either the paint our layout {@group} has changed
 * to a {@newValue}.
 */
export function changeProperty(layer: LayerSpecification, group: keyof LayerSpecification, property: string, newValue: any) {
  // Remove the property if undefined
  if(newValue === undefined) {
    if(group) {
      const newLayer: any = {
        ...layer,
        // Change object so the diff works in ./src/components/map/MaplibreGlMap.jsx
        [group]: {
          ...layer[group] as any
        }
      };
      delete newLayer[group][property];

      // Remove the group if it is now empty
      if(Object.keys(newLayer[group]).length < 1) {
        delete newLayer[group];
      }
      return newLayer;
    } else {
      const newLayer: any = {
        ...layer
      };
      delete newLayer[property];
      return newLayer;
    }
  }
  else {
    if(group) {
      return {
        ...layer,
        [group]: {
          ...layer[group] as any,
          [property]: newValue
        }
      }
    } else {
      return {
        ...layer,
        [property]: newValue
      }
    }
  }
}
