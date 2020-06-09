import React from 'react'
import PropTypes from 'prop-types'

import InputColor from './InputColor'
import InputNumber from './InputNumber'
import InputCheckbox from './InputCheckbox'
import InputString from './InputString'
import InputSelect from './InputSelect'
import InputMultiInput from './InputMultiInput'
import InputArray from './InputArray'
import InputDynamicArray from './InputDynamicArray'
import InputFont from './InputFont'
import InputAutocomplete from './InputAutocomplete'
import InputEnum from './InputEnum'
import capitalize from 'lodash.capitalize'

const iconProperties = ['background-pattern', 'fill-pattern', 'line-pattern', 'fill-extrusion-pattern', 'icon-image']

function labelFromFieldName(fieldName) {
  let label = fieldName.split('-').slice(1).join(' ')
  if(label.length > 0) {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }
  return label
}

function optionsLabelLength(options) {
  let sum = 0;
  options.forEach(([_, label]) => {
    sum += label.length
  })
  return sum
}

/** Display any field from the Mapbox GL style spec and
 * choose the correct field component based on the @{fieldSpec}
 * to display @{value}. */
export default class SpecField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldSpec: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.bool
    ]),
    /** Override the style of the field */
    style: PropTypes.object,
    'aria-label': PropTypes.string,
  }

  render() {
    const commonProps = {
      error: this.props.error,
      fieldSpec: this.props.fieldSpec,
      label: this.props.label,
      action: this.props.action,
      style: this.props.style,
      value: this.props.value,
      default: this.props.fieldSpec.default,
      name: this.props.fieldName,
      onChange: newValue => this.props.onChange(this.props.fieldName, newValue),
      'aria-label': this.props['aria-label'],
    }

    function childNodes() {
      switch(this.props.fieldSpec.type) {
        case 'number': return (
          <InputNumber
            {...commonProps}
            min={this.props.fieldSpec.minimum}
            max={this.props.fieldSpec.maximum}
          />
        )
        case 'enum':
          const options = Object.keys(this.props.fieldSpec.values).map(v => [v, capitalize(v)])

          return <InputEnum
            {...commonProps}
            options={options}
          />
        case 'resolvedImage':
        case 'formatted':
        case 'string':
          if (iconProperties.indexOf(this.props.fieldName) >= 0) {
            const options = this.props.fieldSpec.values || [];
            return <InputAutocomplete
              {...commonProps}
              options={options.map(f => [f, f])}
            />
          } else {
            return <InputString
              {...commonProps}
            />
          }
        case 'color': return (
          <InputColor
            {...commonProps}
          />
        )
        case 'boolean': return (
          <InputCheckbox
            {...commonProps}
          />
        )
        case 'array':
          if(this.props.fieldName === 'text-font') {
            return <InputFont
              {...commonProps}
              fonts={this.props.fieldSpec.values}
            />
          } else {
            if (this.props.fieldSpec.length) {
              return <InputArray
                {...commonProps}
                type={this.props.fieldSpec.value}
                length={this.props.fieldSpec.length}
              />
            } else {
              return <InputDynamicArray
                {...commonProps}
                fieldSpec={this.props.fieldSpec}
                type={this.props.fieldSpec.value}
              />
            }
          }
        default: return null
      }
    }

    return (
      <div data-wd-key={"spec-field:"+this.props.fieldName}>
        {childNodes.call(this)}
      </div>
    );
  }
}
