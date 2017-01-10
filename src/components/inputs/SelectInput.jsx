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
    let options = this.props.options
    if(options.length > 0 && !Array.isArray(options[0])) {
      options = options.map(v => [v, v])
    }

    return <select
      className="maputnik-select"
      style={{
        ...input.select,
        ...this.props.style
      }}
      value={this.props.value}
      onChange={e => this.props.onChange(e.target.value)}
    >
      { options.map(([val, label]) => <option key={val} value={val}>{label}</option>) }
    </select>
  }
}

export default SelectInput
