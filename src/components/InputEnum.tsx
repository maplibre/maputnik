import React from 'react'
import InputSelect from './InputSelect'
import InputMultiInput from './InputMultiInput'


function optionsLabelLength(options: any[]) {
  let sum = 0;
  options.forEach(([_, label]) => {
    sum += label.length
  })
  return sum
}


export type InputEnumProps = {
  "data-wd-key"?: string
  value?: string
  style?: object
  default?: string
  name?: string
  onChange(...args: unknown[]): unknown
  options: any[]
  'aria-label'?: string
  label?: string
};


export default class InputEnum extends React.Component<InputEnumProps> {
  render() {
    const {options, value, onChange, name, label} = this.props;

    if(options.length <= 3 && optionsLabelLength(options) <= 20) {
      return <InputMultiInput
        name={name}
        options={options}
        value={(value || this.props.default)!}
        onChange={onChange}
        aria-label={this.props['aria-label'] || label}
      />
    } else {
      return <InputSelect
        options={options}
        value={(value || this.props.default)!}
        onChange={onChange}
        aria-label={this.props['aria-label'] || label}
      />
    }
  }
}

