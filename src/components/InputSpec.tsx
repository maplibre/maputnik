import React, { ReactElement } from 'react'

import InputColor, { InputColorProps } from './InputColor'
import InputNumber, { InputNumberProps } from './InputNumber'
import InputCheckbox, { InputCheckboxProps } from './InputCheckbox'
import InputString, { InputStringProps } from './InputString'
import InputArray, { FieldArrayProps } from './InputArray'
import InputDynamicArray, { FieldDynamicArrayProps } from './InputDynamicArray'
import InputFont, { FieldFontProps } from './InputFont'
import InputAutocomplete, { InputAutocompleteProps } from './InputAutocomplete'
import InputEnum, { InputEnumProps } from './InputEnum'
import capitalize from 'lodash.capitalize'

const iconProperties = ['background-pattern', 'fill-pattern', 'line-pattern', 'fill-extrusion-pattern', 'icon-image']

export type SpecFieldProps = {
  onChange?(fieldName: string | undefined, value: number | undefined | (string | number | undefined)[]): unknown
  fieldName?: string
  fieldSpec?: {
    default?: unknown
    type?: 'number' | 'enum' | 'resolvedImage' | 'formatted' | 'string' | 'color' | 'boolean' | 'array'
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
export default class SpecField extends React.Component<SpecFieldProps> {

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
          {...commonProps as FieldFontProps}
          fonts={this.props.fieldSpec.values}
        />
      } else {
        if (this.props.fieldSpec.length) {
          return <InputArray
            {...commonProps as FieldArrayProps}
            type={this.props.fieldSpec.value}
            length={this.props.fieldSpec.length}
          />
        } else {
          return <InputDynamicArray
            {...commonProps as FieldDynamicArrayProps}
            fieldSpec={this.props.fieldSpec}
            type={this.props.fieldSpec.value as FieldDynamicArrayProps['type']}
          />
        }
      }
    default: return null
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
