import React from 'react'
import input from '../../config/input.js'

/*** Number fields with support for min, max and units and documentation*/
class NumberField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.number,
    default: React.PropTypes.number,
    unit: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    doc: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  onChange(e) {
    const value = parseFloat(e.target.value)
    /*TODO: we can do range validation already here?
    if(this.props.min && value < this.props.min) return
    if(this.props.max && value > this.props.max) return
    */
    this.props.onChange(value)
  }

  render() {
    let stepSize = null
    if(this.props.max && this.props.min) {
      stepSize = (this.props.max - this.props.min) / 10
    }

    return <input
      style={{
        ...input.input,
        ...this.props.style
      }}
      type="number"
      min={this.props.min}
      max={this.props.max}
      step={stepSize}
      name={this.props.name}
      placeholder={this.props.default}
      value={this.props.value}
      onChange={this.onChange.bind(this)}
    />
  }
}

export default NumberField
