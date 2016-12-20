import React from 'react'
import input from '../../config/input.js'

class BooleanField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.bool,
    doc: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  render() {
    return <input
      type="checkbox"
      style={{
        ...input.checkbox,
        ...this.props.style
      }}
      value={this.props.value}
      onChange={e => {this.props.onChange(!this.props.value)}}
      checked={this.props.value}
    >
    </input>
  }
}

export default BooleanField
