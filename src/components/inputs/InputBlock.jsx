import React from 'react'
import input from '../../config/input'

/** Wrap a component with a label */
class InputBlock extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    children: React.PropTypes.element.isRequired,
  }

  onChange(e) {
    const value = e.target.value
    return this.props.onChange(value === "" ? null: value)
  }

  render() {
    return <div style={{
      display: 'block'
    }}>
      <label style={input.label}>{this.props.label}</label>
      {this.props.children}
    </div>
  }
}

export default InputBlock
