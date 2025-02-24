import React from 'react'

export type InputCheckboxProps = {
  value?: boolean
  style?: object
  onChange(...args: unknown[]): unknown
};

export default class InputCheckbox extends React.Component<InputCheckboxProps> {
  static defaultProps = {
    value: false,
  }

  onChange = () => {
    this.props.onChange(!this.props.value);
  }

  render() {
    return <div className="maputnik-checkbox-wrapper">
      <input
        className="maputnik-checkbox"
        type="checkbox"
        style={this.props.style}
        onChange={this.onChange}
        onClick={this.onChange}
        checked={this.props.value}
      />
      <div className="maputnik-checkbox-box">
        <svg style={{
          display: this.props.value ? 'inline' : 'none'
        }} className="maputnik-checkbox-icon" viewBox='0 0 32 32'>
          <path d='M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z' />
        </svg>
      </div>
    </div>
  }
}
