import React from 'react'
import input from '../../config/input.js'

/*** Number fields with support for min, max and units and documentation*/
class StringField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    default: React.PropTypes.number,
    doc: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  onChange(e) {
    const value = e.target.value
    return this.props.onChange(value === "" ? null: value)
  }

  render() {
    return <input
      style={{
        ...input.input,
        ...this.props.style
      }}
      name={this.props.name}
      placeholder={this.props.default}
      value={this.props.value ? this.props.value : ""}
      onChange={this.onChange.bind(this)}
    />
  }
}

export default StringField
