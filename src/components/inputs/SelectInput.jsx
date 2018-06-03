import React from 'react'
import PropTypes from 'prop-types'

class SelectInput extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    "data-wd-key": PropTypes.string,
    options: PropTypes.array.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }


  render() {
    let options = this.props.options
    if(options.length > 0 && !Array.isArray(options[0])) {
      options = options.map(v => [v, v])
    }

    return <select
      className="maputnik-select"
      data-wd-key={this.props["data-wd-key"]}
      style={this.props.style}
      value={this.props.value}
      onChange={e => this.props.onChange(e.target.value)}
    >
      { options.map(([val, label]) => <option key={val} value={val}>{label}</option>) }
    </select>
  }
}

export default SelectInput
