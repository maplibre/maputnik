import React from 'react'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

import colors from '../../config/colors'
import { margins, fontSizes } from '../../config/scales'

function displayValue(value) {
  if (typeof value === 'undefined' || value === null) return value;
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'object' ||
          typeof value === 'number' ||
          typeof value === 'string') return value.toString();
  return value;
}

function renderProperties(feature) {
  return Object.keys(feature.properties).map(propertyName => {
    const property = feature.properties[propertyName]
    return <InputBlock key={propertyName} label={propertyName} style={{marginTop: 0, marginBottom: 0}}>
      <StringInput value={displayValue(property)} style={{backgroundColor: 'transparent'}}/>
    </InputBlock>
  })
}

const Panel = (props) => {
  return <div style={{
    backgroundColor: colors.gray,
    padding: margins[0],
    fontSize: fontSizes[5],
    lineHeight: 1.2,
  }}>{props.children}</div>
}

function renderFeature(feature) {
  return <div key={feature.id}>
    <Panel>{feature.layer['source-layer']}</Panel>
    {renderProperties(feature)}
  </div>
}

class FeaturePropertyPopup extends React.Component {

  render() {
    const features = this.props.features
    return <div>
      {features.map(renderFeature)}
    </div>
  }
}


export default FeaturePropertyPopup
