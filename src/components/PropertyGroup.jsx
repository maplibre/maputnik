import React from 'react'
import PropTypes from 'prop-types'

import FieldFunction from './FieldFunction'
const iconProperties = ['background-pattern', 'fill-pattern', 'line-pattern', 'fill-extrusion-pattern', 'icon-image']

/** Extract field spec by {@fieldName} from the {@layerType} in the
 * style specification from either the paint or layout group */
function getFieldSpec(spec, layerType, fieldName) {
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

function getGroupName(spec, layerType, fieldName) {
  const paint  = spec['paint_' + layerType] || {}
  if (fieldName in paint) {
    return 'paint'
  } else {
    return 'layout'
  }
}

export default class PropertyGroup extends React.Component {
  static propTypes = {
    layer: PropTypes.object.isRequired,
    groupFields: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    spec: PropTypes.object.isRequired,
    errors: PropTypes.object,
  }

  onPropertyChange = (property, newValue) => {
    const group = getGroupName(this.props.spec, this.props.layer.type, property)
    this.props.onChange(group , property, newValue)
  }

  render() {
    const {errors} = this.props;
    const fields = this.props.groupFields.map(fieldName => {
      const fieldSpec = getFieldSpec(this.props.spec, this.props.layer.type, fieldName)

      const paint = this.props.layer.paint || {}
      const layout = this.props.layer.layout || {}
      const fieldValue = fieldName in paint ? paint[fieldName] : layout[fieldName]
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
