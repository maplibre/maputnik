import React from 'react'
import inputStyle from './input.js'

class BooleanField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.bool,
    doc: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  render() {
    return <div style={inputStyle.property}>
      <label style={inputStyle.label}>{this.props.name}</label>
      <input
        type="checkbox"
        style={{
          ...inputStyle.checkbox,
          ...this.props.style
        }}
        value={this.props.value}
        onChange={e => {this.props.onChange(!this.props.value)}}
        checked={this.props.value}
      >
      </input>
    </div>
  }
}

export default BooleanField
