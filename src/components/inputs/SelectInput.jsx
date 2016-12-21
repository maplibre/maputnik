import React from 'react'
import input from '../../config/input.js'

class SelectInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  }


  render() {
    const options = this.props.options.map(([val, label])=> {
      return <option key={val} value={val}>{label}</option>
    })

    return <select
      style={{
        ...input.select,
        ...this.props.style
      }}
      value={this.props.value}
      onChange={e => this.props.onChange(e.target.value)}
    >
      {options}
    </select>
  }
}

export default SelectInput
