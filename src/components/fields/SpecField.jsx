import React from 'react'
import color from 'color'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'
import ColorField from './ColorField'
import NumberInput from '../inputs/NumberInput'
import CheckboxInput from '../inputs/CheckboxInput'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import MultiButtonInput from '../inputs/MultiButtonInput'
import capitalize from 'lodash.capitalize'


import input from '../../config/input.js'

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
      style: this.props.style,
      value: this.props.value,
      name: this.props.fieldName,
      onChange: newValue => this.props.onChange(this.props.fieldName, newValue)
    }
    console.log(this.props.fieldName, this.props.fieldSpec.type)
    switch(this.props.fieldSpec.type) {
      case 'number': return (
        <NumberInput
          {...commonProps}
          default={this.props.fieldSpec.default}
          min={this.props.fieldSpec.minimum}
          max={this.props.fieldSpec.maximum}
        />
      )
      case 'enum':
        const options = Object.keys(this.props.fieldSpec.values).map(v => [v, capitalize(v)])
        if(options.length < 3) {
          return <MultiButtonInput
            {...commonProps}
            options={options}
          />
        } else {
          return <SelectInput
            {...commonProps}
            options={options}
          />
        }
      case 'string': return (
        <StringInput
          {...commonProps}
        />
      )
      case 'color': return (
        <ColorField
          {...commonProps}
        />
      )
      case 'boolean': return (
        <CheckboxInput
          {...commonProps}
        />
      )
      default: return null
    }
  }
}
