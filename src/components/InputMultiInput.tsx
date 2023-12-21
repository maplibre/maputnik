import React from 'react'
import classnames from 'classnames'

type InputMultiInputProps = {
  name?: string
  value: string
  options: any[]
  onChange(...args: unknown[]): unknown
  'aria-label'?: string
};

export default class InputMultiInput extends React.Component<InputMultiInputProps> {
  render() {
    let options = this.props.options
    if(options.length > 0 && !Array.isArray(options[0])) {
      options = options.map(v => [v, v])
    }

    const selectedValue = this.props.value || options[0][0]
    const radios = options.map(([val, label])=> {
      return <label
        key={val}
        className={classnames("maputnik-radio-as-button", {"maputnik-button-selected": val === selectedValue})}
      >
        <input type="radio"
          name={this.props.name}
          onChange={_e => this.props.onChange(val)}
          value={val}
          checked={val === selectedValue}
        />
        {label}
      </label>
    })

    return <fieldset className="maputnik-multibutton" aria-label={this.props['aria-label']}>
      {radios}
    </fieldset>
  }
}


