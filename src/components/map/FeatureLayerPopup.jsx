import React from 'react'
import PropTypes from 'prop-types'
import LayerIcon from '../icons/LayerIcon'

function groupFeaturesBySourceLayer(features) {
  const sources = {}

  let returnedFeatures = {};

  features.forEach(feature => {
    if(returnedFeatures.hasOwnProperty(feature.layer.id)) {
      returnedFeatures[feature.layer.id]++
      
      const featureObject = sources[feature.layer['source-layer']].find(f => f.layer.id === feature.layer.id)

      featureObject.counter = returnedFeatures[feature.layer.id]
    } else {
      sources[feature.layer['source-layer']] = sources[feature.layer['source-layer']] || []
      sources[feature.layer['source-layer']].push(feature)

      returnedFeatures[feature.layer.id] = 1
    }
  })

  return sources
}

class FeatureLayerPopup extends React.Component {
  static propTypes = {
    onLayerSelect: PropTypes.func.isRequired,
    features: PropTypes.array
  }

  render() {
    const sources = groupFeaturesBySourceLayer(this.props.features)

    const items = Object.keys(sources).map(vectorLayerId => {
      const layers = sources[vectorLayerId].map((feature, idx) => {
        return <label
          key={idx}
          className="maputnik-popup-layer"
          onClick={() => {
            this.props.onLayerSelect(feature.layer.id)
          }}
        >
          <LayerIcon type={feature.layer.type} style={{
            width: 14,
            height: 14,
            paddingRight: 3
          }}/>
          {feature.layer.id}
          {feature.counter && <span> × {feature.counter}</span>}
        </label>
      })
      return <div key={vectorLayerId}>
        <div className="maputnik-popup-layer-id">{vectorLayerId}</div>
        {layers}
      </div>
    })

    return <div className="maputnik-feature-layer-popup">
      {items}
    </div>
  }
}


export default FeatureLayerPopup
