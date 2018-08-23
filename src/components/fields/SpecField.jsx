import React from 'react'
import PropTypes from 'prop-types'

import ColorField from './ColorField'
import NumberInput from '../inputs/NumberInput'
import CheckboxInput from '../inputs/CheckboxInput'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import MultiButtonInput from '../inputs/MultiButtonInput'
import ArrayInput from '../inputs/ArrayInput'
import DynamicArrayInput from '../inputs/DynamicArrayInput'
import FontInput from '../inputs/FontInput'
import IconInput from '../inputs/IconInput'
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
  }

  render() {
    const commonProps = {
      style: this.props.style,
      value: this.props.value,
      default: this.props.fieldSpec.default,
      name: this.props.fieldName,
      onChange: newValue => this.props.onChange(this.props.fieldName, newValue)
    }

    function childNodes() {
      switch(this.props.fieldSpec.type) {
        case 'number': return (
          <NumberInput
            {...commonProps}
            min={this.props.fieldSpec.minimum}
            max={this.props.fieldSpec.maximum}
          />
        )
        case 'enum':
          const options = Object.keys(this.props.fieldSpec.values).map(v => [v, capitalize(v)])

          if(options.length <= 3 && optionsLabelLength(options) <= 20) {
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
        case 'string':
          if(iconProperties.indexOf(this.props.fieldName) >= 0) {
            return <IconInput
              {...commonProps}
              icons={this.props.fieldSpec.values}
            />
          } else {
            return <StringInput
              {...commonProps}
            />
          }
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
        case 'array':
          if(this.props.fieldName === 'text-font') {
            return <FontInput
              {...commonProps}
              fonts={this.props.fieldSpec.values}
            />
          } else {
            if (this.props.fieldSpec.length) {
              return <ArrayInput
                {...commonProps}
                type={this.props.fieldSpec.value}
                length={this.props.fieldSpec.length}
              />
            } else {
              return <DynamicArrayInput
                {...commonProps}
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
