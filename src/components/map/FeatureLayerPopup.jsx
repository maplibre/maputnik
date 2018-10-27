import React from 'react'
import PropTypes from 'prop-types'
import LayerIcon from '../icons/LayerIcon'
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

  render() {
    const sources = groupFeaturesBySourceLayer(this.props.features)

    const items = Object.keys(sources).map(vectorLayerId => {
      const layers = sources[vectorLayerId].map((feature, idx) => {
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

        let swatchColor;

        if(propName) {
          const propertySpec = latest["paint_"+feature.layer.type][propName];

          let color = feature.layer.paint[propName];

          if(typeof(color) === "object") {
            if(color.stops) {
              color = styleFunction.convertFunction(color, propertySpec);
            }

            const exprResult = expression.createExpression(color, propertySpec);
            const val = exprResult.value.evaluate({
              zoom: this.props.zoom
            }, feature);
            swatchColor = val.toString();
          }
          else {
            swatchColor = color;
          }
        }
        else {
          // Default color
          swatchColor = "black";
        }

        return <div
            key={idx}
            className="maputnik-popup-layer"
        >
          <div
            className="maputnik-popup-layer__swatch" 
            style={{background: swatchColor}}
          ></div>
          <label
            className="maputnik-popup-layer__label"
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
