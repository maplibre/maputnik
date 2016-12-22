import React from 'react'
import input from '../../config/input.js'

class StringInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <input
      style={{
        ...input.input,
        ...this.props.style
      }}
      value={this.props.value}
      onChange={e => this.props.onChange(e.target.value)}
    />
  }
}

export default StringInput
