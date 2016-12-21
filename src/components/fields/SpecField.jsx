import React from 'react'
import color from 'color'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'
import NumberField from './NumberField'
import EnumField from './EnumField'
import BooleanField from './BooleanField'
import ColorField from './ColorField'
import StringField from './StringField'

import input from '../../config/input.js'
import theme from '../../config/rebass.js'

function labelFromFieldName(fieldName) {
  let label = fieldName.split('-').slice(1).join(' ')
  if(label.length > 0) {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }
  return label
}

/** Display any field from the Mapbox GL style spec and
 * choose the correct field component based on the @{fieldSpec}
 * to display @{value}. */
export default class SpecField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    fieldSpec: React.PropTypes.object.isRequired,

    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    /** Override the style of the field */
    style: React.PropTypes.object,
  }

  render() {
    const commonProps = {
      doc: this.props.fieldSpec.doc,
      style: this.props.style,
      value: this.props.value,
      name: this.props.fieldName,
      onChange: newValue => this.props.onChange(this.props.fieldName, newValue)
    }
    switch(this.props.fieldSpec.type) {
      case 'number': return (
        <NumberField
          {...commonProps}
          default={this.props.fieldSpec.default}
          min={this.props.fieldSpec.minimum}
          max={this.props.fieldSpec.maximum}
          unit={this.props.fieldSpec.unit}
        />
      )
      case 'enum': return (
        <EnumField
          {...commonProps}
          allowedValues={Object.keys(this.props.fieldSpec.values)}
        />
      )
      case 'string': return (
        <StringField
          {...commonProps}
        />
      )
      case 'color': return (
        <ColorField
          {...commonProps}
        />
      )
      case 'boolean': return (
        <BooleanField
          {...commonProps}
        />
      )
      default: return null
    }
  }
}
