import React from 'react'
import PropTypes from 'prop-types'
import IconLayer from './IconLayer'
import {latest, expression, function as styleFunction} from '@mapbox/mapbox-gl-style-spec'

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
    features: PropTypes.array,
    zoom: PropTypes.number,
  }

  _getFeatureColor(feature, zoom) {
    // Guard because openlayers won't have this
    if (!feature.layer.paint) {
      return;
    }

    try {
      const paintProps = feature.layer.paint;
      let propName;

      if(paintProps.hasOwnProperty("text-color") && paintProps["text-color"]) {
        propName = "text-color";
      }
      else if (paintProps.hasOwnProperty("fill-color") && paintProps["fill-color"]) {
        propName = "fill-color";
      }
      else if (paintProps.hasOwnProperty("line-color") && paintProps["line-color"]) {
        propName = "line-color";
      }
      else if (paintProps.hasOwnProperty("fill-extrusion-color") && paintProps["fill-extrusion-color"]) {
        propName = "fill-extrusion-color";
      }

      if(propName) {
        const propertySpec = latest["paint_"+feature.layer.type][propName];
        let color = feature.layer.paint[propName];
        return String(color);
      }
      else {
        // Default color
        return "black";
      }
    }
    // This is quite complex, just incase there's an edgecase we're missing
    // always return black if we get an unexpected error.
    catch (err) {
      console.warn("Unable to get feature color, error:", err);
      return "black";
    }
  }

  render() {
    const sources = groupFeaturesBySourceLayer(this.props.features)

    const items = Object.keys(sources).map(vectorLayerId => {
      const layers = sources[vectorLayerId].map((feature, idx) => {
        const featureColor = this._getFeatureColor(feature, this.props.zoom);

        return <div
            key={idx}
            className="maputnik-popup-layer"
        >
          <div
            className="maputnik-popup-layer__swatch" 
            style={{background: featureColor}}
          ></div>
          <label
            className="maputnik-popup-layer__label"
            onClick={() => {
              this.props.onLayerSelect(feature.layer.id)
            }}
          >
            {feature.layer.type && 
              <IconLayer type={feature.layer.type} style={{
                width: 14,
                height: 14,
                paddingRight: 3
              }}/>
            }
            {feature.layer.id}
            {feature.counter && <span> × {feature.counter}</span>}
          </label>
        </div>
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
