import React from 'react'
import inputStyle from './input.js'

class EnumField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    allowedValues: React.PropTypes.array.isRequired,
    doc: React.PropTypes.string,
  }

  onChange(e) {
    return this.props.onChange(e.target.value)
  }

  render() {
    const options = this.props.allowedValues.map(val => {
      return <option key={val} value={val}>{val}</option>
    })

    return <div style={inputStyle.property}>
      <label style={inputStyle.label}>{this.props.name}</label>
      <select
        style={inputStyle.select}
        value={this.props.value}
        onChange={this.onChange.bind(this)}
      >
        {options}
      </select>
    </div>
  }
}

export default EnumField
