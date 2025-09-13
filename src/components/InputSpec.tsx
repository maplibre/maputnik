import React, { ReactElement } from 'react'

import InputColor, { InputColorProps } from './InputColor'
import InputNumber, { InputNumberProps } from './InputNumber'
import InputCheckbox, { InputCheckboxProps } from './InputCheckbox'
import InputString, { InputStringProps } from './InputString'
import InputArray, { InputArrayProps } from './InputArray'
import InputDynamicArray, { InputDynamicArrayProps } from './InputDynamicArray'
import InputFont, { InputFontProps } from './InputFont'
import InputAutocomplete, { InputAutocompleteProps } from './InputAutocomplete'
import InputEnum, { InputEnumProps } from './InputEnum'
import capitalize from 'lodash.capitalize'

const iconProperties = ['background-pattern', 'fill-pattern', 'line-pattern', 'fill-extrusion-pattern', 'icon-image']

export type FieldSpecType = 'number' | 'enum' | 'resolvedImage' | 'formatted' | 'string' | 'color' | 'boolean' | 'array' | 'numberArray' | 'padding' | 'colorArray' | 'variableAnchorOffsetCollection';

export type InputSpecProps = {
  onChange?(fieldName: string | undefined, value: number | undefined | (string | number | undefined)[]): unknown
  fieldName?: string
  fieldSpec?: {
    default?: unknown
    type?: FieldSpecType
    minimum?: number
    maximum?: number
    values?: unknown[]
    length?: number
    value?: string
  }
  value?: string | number | unknown[] | boolean
  /** Override the style of the field */
  style?: object
  'aria-label'?: string
  error?: unknown[]
  label?: string
  action?: ReactElement
};

/** Display any field from the Maplibre GL style spec and
 * choose the correct field component based on the @{fieldSpec}
 * to display @{value}. */
export default class InputSpec extends React.Component<InputSpecProps> {

  childNodes() {
    const commonProps = {
      error: this.props.error,
      fieldSpec: this.props.fieldSpec,
      label: this.props.label,
      action: this.props.action,
      style: this.props.style,
      value: this.props.value,
      default: this.props.fieldSpec?.default,
      name: this.props.fieldName,
      "data-wd-key": "spec-field-input:" + this.props.fieldName,
      onChange: (newValue: number | undefined | (string | number | undefined)[]) => this.props.onChange!(this.props.fieldName, newValue),
      'aria-label': this.props['aria-label'],
    }
    switch(this.props.fieldSpec?.type) {
    case 'number': return (
      <InputNumber
        {...commonProps as InputNumberProps}
        min={this.props.fieldSpec.minimum}
        max={this.props.fieldSpec.maximum}
      />
    )
    case 'enum': {
      const options = Object.keys(this.props.fieldSpec.values || []).map(v => [v, capitalize(v)])

      return <InputEnum
        {...commonProps as Omit<InputEnumProps, "options">}
        options={options}
      />
    }
    case 'resolvedImage':
    case 'formatted':
    case 'string':
      if (iconProperties.indexOf(this.props.fieldName!) >= 0) {
        const options = this.props.fieldSpec.values || [];
        return <InputAutocomplete
          {...commonProps as Omit<InputAutocompleteProps, "options">}
          options={options.map(f => [f, f])}
        />
      } else {
        return <InputString
          {...commonProps as InputStringProps}
        />
      }
    case 'color': return (
      <InputColor
        {...commonProps as InputColorProps}
      />
    )
    case 'boolean': return (
      <InputCheckbox
        {...commonProps as InputCheckboxProps}
      />
    )
    case 'array':
      if(this.props.fieldName === 'text-font') {
        return <InputFont
          {...commonProps as InputFontProps}
          fonts={this.props.fieldSpec.values}
        />
      } else {
        if (this.props.fieldSpec.length) {
          return <InputArray
            {...commonProps as InputArrayProps}
            type={this.props.fieldSpec.value}
            length={this.props.fieldSpec.length}
          />
        } else {
          return <InputDynamicArray
            {...commonProps as InputDynamicArrayProps}
            fieldSpec={this.props.fieldSpec}
            type={this.props.fieldSpec.value as InputDynamicArrayProps['type']}
          />
        }
      }
    case 'numberArray': return (
      <InputDynamicArray
        {...commonProps as InputDynamicArrayProps}
        fieldSpec={this.props.fieldSpec}
        type="number"
        value={(Array.isArray(this.props.value) ? this.props.value : [this.props.value]) as (string | number | undefined)[]}
      />
    )
    case 'colorArray': return (
      <InputDynamicArray
        {...commonProps as InputDynamicArrayProps}
        fieldSpec={this.props.fieldSpec}
        type="color"
        value={(Array.isArray(this.props.value) ? this.props.value : [this.props.value]) as (string | number | undefined)[]}
      />
    )
    case 'padding': return (
      <InputArray
        {...commonProps as InputArrayProps}
        type="number"
        value={(Array.isArray(this.props.value) ? this.props.value : [this.props.value]) as (string | number | undefined)[]}
        length={4}
      />
    )
    default:
      console.warn(`No proper field input for ${this.props.fieldName} type: ${this.props.fieldSpec?.type}`);
      return null
    }
  }

  render() {
    return (
      <div data-wd-key={"spec-field:"+this.props.fieldName}>
        {this.childNodes()}
      </div>
    );
  }
}
