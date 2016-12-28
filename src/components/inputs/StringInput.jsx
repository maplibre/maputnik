import React from 'react'
import input from '../../config/input.js'

class StringInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    style: React.PropTypes.object,
    default: React.PropTypes.number,
    onChange: React.PropTypes.func,
  }

  render() {
    return <input
      style={{
        ...input.input,
        ...this.props.style
      }}
      value={this.props.value}
      placeholder={this.props.default}
      onChange={e => this.props.onChange(e.target.value)}
    />
  }
}

export default StringInput
