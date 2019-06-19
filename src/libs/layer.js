import {latest} from '@mapbox/mapbox-gl-style-spec'

export function changeType(layer, newType) {
  const changedPaintProps = { ...layer.paint }
  Object.keys(changedPaintProps).forEach(propertyName => {
    if(!(propertyName in latest['paint_' + newType])) {
      delete changedPaintProps[propertyName]
    }
  })

  const changedLayoutProps = { ...layer.layout }
  Object.keys(changedLayoutProps).forEach(propertyName => {
    if(!(propertyName in latest['layout_' + newType])) {
      delete changedLayoutProps[propertyName]
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
export function changeProperty(layer, group, property, newValue) {
  // Remove the property if undefined
  if(newValue === undefined) {
    if(group) {
      const newLayer = {
        ...layer,
        // Change object so the diff works in ./src/components/map/MapboxGlMap.jsx
        [group]: {
          ...layer[group]
        }
      };
      delete newLayer[group][property];

      // Remove the group if it is now empty
      if(Object.keys(newLayer[group]).length < 1) {
        delete newLayer[group];
      }
      return newLayer;
    } else {
      const newLayer = {
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
          ...layer[group],
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
