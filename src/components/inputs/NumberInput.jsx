import React from 'react'
import input from '../../config/input.js'

class NumberInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.number,
    style: React.PropTypes.object,
    default: React.PropTypes.number,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    onChange: React.PropTypes.func,
  }

  onChange(e) {
    const value = parseFloat(e.target.value)
    /*TODO: we can do range validation already here?
    if(this.props.min && value < this.props.min) return
    if(this.props.max && value > this.props.max) return
    */

    if(isNaN(value)) {
      this.props.onChange(this.props.default)
    } else {
      this.props.onChange(value)
    }
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
      type={"number"}
      min={this.props.min}
      max={this.props.max}
      step={stepSize}
      placeholder={this.props.default}
      value={this.props.value}
      onChange={this.onChange.bind(this)}
    />
  }
}

export default NumberInput
