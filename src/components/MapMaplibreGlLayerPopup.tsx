import React from "react";
import IconLayer from "./IconLayer";
import type {InspectFeature} from "./MapMaplibreGlFeaturePropertyPopup";

function groupFeaturesBySourceLayer(features: InspectFeature[]) {
  const sources: {[key: string]: InspectFeature[]} = {};

  const returnedFeatures: {[key: string]: number} = {};

  features.forEach(feature => {
    const sourceKey = feature.layer["source-layer"] as string;
    if(Object.prototype.hasOwnProperty.call(returnedFeatures, feature.layer.id)) {
      returnedFeatures[feature.layer.id]++;

      const featureObject = sources[sourceKey].find((f: InspectFeature) => f.layer.id === feature.layer.id);

      featureObject!.counter = returnedFeatures[feature.layer.id];
    } else {
      sources[sourceKey] = sources[sourceKey] || [];
      sources[sourceKey].push(feature);

      returnedFeatures[feature.layer.id] = 1;
    }
  });

  return sources;
}

type FeatureLayerPopupProps = {
  onLayerSelect(layerId: string): unknown
  features: InspectFeature[]
  zoom?: number
};

class FeatureLayerPopup extends React.Component<FeatureLayerPopupProps> {
  _getFeatureColor(feature: InspectFeature, _zoom?: number) {
    // Guard because openlayers won't have this
    if (!feature.layer.paint) {
      return;
    }

    try {
      const paintProps = feature.layer.paint;

      if("text-color" in paintProps && paintProps["text-color"]) {
        return String(paintProps["text-color"]);
      }
      if ("fill-color" in paintProps && paintProps["fill-color"]) {
        return String(paintProps["fill-color"]);
      }
      if ("line-color" in paintProps && paintProps["line-color"]) {
        return String(paintProps["line-color"]);
      }
      if ("fill-extrusion-color" in paintProps && paintProps["fill-extrusion-color"]) {
        return String(paintProps["fill-extrusion-color"]);
      }
      // Default color
      return "black";
    }
    // This is quite complex, just incase there's an edgecase we're missing
    // always return black if we get an unexpected error.
    catch (err) {
      console.warn("Unable to get feature color, error:", err);
      return "black";
    }
  }

  render() {
    const sources = groupFeaturesBySourceLayer(this.props.features);

    const items = Object.keys(sources).map(vectorLayerId => {
      const layers = sources[vectorLayerId].map((feature: InspectFeature, idx: number) => {
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
              this.props.onLayerSelect(feature.layer.id);
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
        </div>;
      });
      return <div key={vectorLayerId}>
        <div className="maputnik-popup-layer-id">{vectorLayerId}</div>
        {layers}
      </div>;
    });

    return <div className="maputnik-feature-layer-popup" data-wd-key="feature-layer-popup" dir="ltr">
      {items}
    </div>;
  }
}


export default FeatureLayerPopup;
