import React from 'react'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import LayerIcon from '../icons/LayerIcon'
import input from '../../config/input'

import colors from '../../config/colors'
import { margins, fontSizes } from '../../config/scales'

const Panel = (props) => {
  return <div style={{
    backgroundColor: colors.gray,
    padding: margins[0],
    fontSize: fontSizes[5],
    lineHeight: 1.2,
  }}>{props.children}</div>
}

function renderFeature(feature) {
  return <div>
    <Panel>{feature.layer['source-layer']}</Panel>
  </div>
}

function groupFeaturesBySourceLayer(features) {
  const sources = {}
  features.forEach(feature => {
    sources[feature.layer['source-layer']] = sources[feature.layer['source-layer']] || []
    sources[feature.layer['source-layer']].push(feature)
  })
  return sources
}

class FeatureLayerTable extends React.Component {
  render() {
    const sources = groupFeaturesBySourceLayer(this.props.features)

    const items = Object.keys(sources).map(vectorLayerId => {
      const layers = sources[vectorLayerId].map(feature => {
        return <label style={{
            ...input.label,
            display: 'block',
            width: 'auto',
          }}>
          <LayerIcon type={feature.layer.type} style={{
            width: fontSizes[4],
            height: fontSizes[4],
            paddingRight: margins[0],
          }}/>
          {feature.layer.id}
        </label>
      })
      return <div>
        <Panel>{vectorLayerId}</Panel>
        {layers}
      </div>
    })

    return <div>
      {items}
    </div>
  }
}


export default FeatureLayerTable
