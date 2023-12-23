import React from 'react'

import FieldFunction from './FieldFunction'
import { LayerSpecification } from '@maplibre/maplibre-gl-style-spec'
const iconProperties = ['background-pattern', 'fill-pattern', 'line-pattern', 'fill-extrusion-pattern', 'icon-image']

/** Extract field spec by {@fieldName} from the {@layerType} in the
 * style specification from either the paint or layout group */
function getFieldSpec(spec: any, layerType: LayerSpecification["type"], fieldName: string) {
  const groupName = getGroupName(spec, layerType, fieldName)
  const group = spec[groupName + '_' + layerType]
  const fieldSpec = group[fieldName]
  if(iconProperties.indexOf(fieldName) >= 0) {
    return {
      ...fieldSpec,
      values: spec.$root.sprite.values
    }
  }
  if(fieldName === 'text-font') {
    return {
      ...fieldSpec,
      values: spec.$root.glyphs.values
    }
  }
  return fieldSpec
}

function getGroupName(spec: any, layerType: LayerSpecification["type"], fieldName: string) {
  const paint  = spec['paint_' + layerType] || {}
  if (fieldName in paint) {
    return 'paint'
  } else {
    return 'layout'
  }
}

type PropertyGroupProps = {
  layer: LayerSpecification
  groupFields: string[]
  onChange(...args: unknown[]): unknown
  spec: any
  errors?: {[key: string]: {message: string}}
};

export default class PropertyGroup extends React.Component<PropertyGroupProps> {
  onPropertyChange = (property: string, newValue: any) => {
    const group = getGroupName(this.props.spec, this.props.layer.type, property)
    this.props.onChange(group ,property, newValue)
  }

  render() {
    const {errors} = this.props;
    const fields = this.props.groupFields.map(fieldName => {
      const fieldSpec = getFieldSpec(this.props.spec, this.props.layer.type, fieldName)

      const paint = this.props.layer.paint || {}
      const layout = this.props.layer.layout || {}
      const fieldValue = fieldName in paint 
        ? paint[fieldName as keyof typeof paint] 
        : layout[fieldName as keyof typeof layout]
      const fieldType = fieldName in paint ? 'paint' : 'layout';

      return <FieldFunction
        errors={errors}
        onChange={this.onPropertyChange}
        key={fieldName}
        fieldName={fieldName}
        value={fieldValue}
        fieldType={fieldType}
        fieldSpec={fieldSpec}
      />
    })

    return <div className="maputnik-property-group">
      {fields}
    </div>
  }
}
