import React from 'react'
import input from '../../config/input.js'

class EnumField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    allowedValues: React.PropTypes.array.isRequired,
    doc: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  onChange(e) {
    return this.props.onChange(e.target.value)
  }

  render() {
    const options = this.props.allowedValues.map(val => {
      return <option key={val} value={val}>{val}</option>
    })

    return <select
      style={{
        ...input.select,
        ...this.props.style
      }}
      value={this.props.value}
      onChange={this.onChange.bind(this)}
    >
      {options}
    </select>
  }
}

export default EnumField
