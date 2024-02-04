import React from 'react'

export type InspectFeature = {
  id: string
  properties: {[key:string]: any}
  layer: {[key:string]: any}
  geometry: GeoJSON.Geometry
  sourceLayer: string
  inspectModeCounter?: number
  counter?: number
}

function displayValue(value: string | number | Date | object) {
  if (typeof value === 'undefined' || value === null) return value;
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'object' ||
          typeof value === 'number' ||
          typeof value === 'string') return value.toString();
  return value;
}

function renderFeature(feature: InspectFeature, idx: number) {
  return <div key={`${feature.sourceLayer}-${idx}`}>
    <div className="maputnik-popup-layer-id">{feature.layer['source']}: {feature.layer['source-layer']}{feature.inspectModeCounter && <span> × {feature.inspectModeCounter}</span>}</div>
    <div className="maputnik-popup-layer">
      <div className="maputnik-popup-feature-left">$type</div>
      <div className="maputnik-popup-feature-right">{feature.geometry.type}</div>
    </div>
    <div className="maputnik-popup-layer">
      <div className="maputnik-popup-feature-left">feature_id</div>
      <div className="maputnik-popup-feature-right">{displayValue(feature.id)}</div>
    </div>
    {Object.keys(feature.properties).map(propertyName => {
      const property = feature.properties[propertyName];
        return <div className="maputnik-popup-layer">
          <div className="maputnik-popup-feature-left">{propertyName}</div>
          <div className="maputnik-popup-feature-right">{displayValue(property)}</div>
        </div>
    })}
  </div>
}

function removeDuplicatedFeatures(features: InspectFeature[]) {
  const uniqueFeatures: InspectFeature[] = [];

  features.forEach(feature => {
    const featureIndex = uniqueFeatures.findIndex(feature2 => {
      return feature.layer['source-layer'] === feature2.layer['source-layer']
        && JSON.stringify(feature.properties) === JSON.stringify(feature2.properties)
    })

    if(featureIndex === -1) {
      uniqueFeatures.push(feature)
    } else {
      if('inspectModeCounter' in uniqueFeatures[featureIndex]) {
        uniqueFeatures[featureIndex].inspectModeCounter!++
      } else {
        uniqueFeatures[featureIndex].inspectModeCounter = 2
      }
    }
  })

  return uniqueFeatures
}

type FeaturePropertyPopupProps = {
  features: InspectFeature[]
};

class FeaturePropertyPopup extends React.Component<FeaturePropertyPopupProps> {
  render() {
    const features = removeDuplicatedFeatures(this.props.features)
    return <div className="maputnik-feature-property-popup">
      {features.map(renderFeature)}
    </div>
  }
}


export default FeaturePropertyPopup
