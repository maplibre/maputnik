import React from 'react'
import Immutable from 'immutable'
import color from 'color'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'
import NumberField from './NumberField'
import EnumField from './EnumField'
import BooleanField from './BooleanField'
import ColorField from './ColorField'
import StringField from './StringField'

import input from '../../config/input.js'
import theme from '../../config/rebass.js'

function isZoomField(value) {
  return Immutable.Map.isMap(value)
}

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

  onValueChanged(property, value) {
    return this.props.onChange(property, value)
  }

  render() {
    switch(this.props.fieldSpec.type) {
      case 'number': return (
        <NumberField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={this.props.fieldName}
          default={this.props.fieldSpec.default}
          min={this.props.fieldSpec.min}
          max={this.props.fieldSpec.max}
          unit={this.props.fieldSpec.unit}
          doc={this.props.fieldSpec.doc}
          style={this.props.style}
        />
      )
      case 'enum': return (
        <EnumField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={this.props.fieldName}
          allowedValues={Object.keys(this.props.fieldSpec.values)}
          doc={this.props.fieldSpec.doc}
          style={this.props.style}
        />
      )
      case 'string': return (
        <StringField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={this.props.fieldName}
          doc={this.props.fieldSpec.doc}
          style={this.props.style}
        />
      )
      case 'color': return (
        <ColorField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={this.props.fieldName}
          doc={this.props.fieldSpec.doc}
          style={this.props.style}
        />
      )
      case 'boolean': return (
        <BooleanField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={this.props.fieldName}
          doc={this.props.fieldSpec.doc}
          style={this.props.style}
        />
      )
      default: return null
    }
  }
}
