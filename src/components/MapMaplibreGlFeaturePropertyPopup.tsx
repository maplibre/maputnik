import React from "react";
import type { GeoJSONFeatureWithSourceLayer } from "@maplibre/maplibre-gl-inspect";

export type InspectFeature = GeoJSONFeatureWithSourceLayer & {
  inspectModeCounter?: number
  counter?: number
};

function displayValue(value: string | number | Date | object | undefined) {
  if (typeof value === "undefined" || value === null) return value;
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "object" ||
          typeof value === "number" ||
          typeof value === "string") return value.toString();
  return value;
}

function renderKeyValueTableRow(key: string, value: string | undefined) {
  return <tr key={key}>
    <td className="maputnik-popup-table-cell">{key}</td>
    <td className="maputnik-popup-table-cell">{value}</td>
  </tr>;
}

function renderFeature(feature: InspectFeature, idx: number) {
  return <React.Fragment key={idx}>
    <tr>
      <td colSpan={2} className="maputnik-popup-layer-id">{feature.layer["source"]}: {feature.layer["source-layer"]}{feature.inspectModeCounter && <span> × {feature.inspectModeCounter}</span>}</td>
    </tr>
    {renderKeyValueTableRow("$type", feature.geometry.type)}
    {renderKeyValueTableRow("$id", displayValue(feature.id))}
    {Object.keys(feature.properties).map(propertyName => {
      const property = feature.properties[propertyName];
      return renderKeyValueTableRow(propertyName, displayValue(property));
    })}
  </React.Fragment>;
}

function removeDuplicatedFeatures(features: InspectFeature[]) {
  const uniqueFeatures: InspectFeature[] = [];

  features.forEach(feature => {
    const featureIndex = uniqueFeatures.findIndex(feature2 => {
      return feature.layer["source-layer"] === feature2.layer["source-layer"]
        && JSON.stringify(feature.properties) === JSON.stringify(feature2.properties);
    });

    if(featureIndex === -1) {
      uniqueFeatures.push(feature);
    } else {
      if("inspectModeCounter" in uniqueFeatures[featureIndex]) {
        uniqueFeatures[featureIndex].inspectModeCounter!++;
      } else {
        uniqueFeatures[featureIndex].inspectModeCounter = 2;
      }
    }
  });

  return uniqueFeatures;
}

type FeaturePropertyPopupProps = {
  features: InspectFeature[]
};

class FeaturePropertyPopup extends React.Component<FeaturePropertyPopupProps> {
  render() {
    const features = removeDuplicatedFeatures(this.props.features);
    return <div className="maputnik-feature-property-popup" dir="ltr" data-wd-key="feature-property-popup">
      <table className="maputnik-popup-table">
        <tbody>
          {features.map(renderFeature)}
        </tbody>
      </table>
    </div>;
  }
}


export default FeaturePropertyPopup;
