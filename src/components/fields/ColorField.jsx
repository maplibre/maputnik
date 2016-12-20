import React from 'react'
import Color from 'color'
import ChromePicker from 'react-color/lib/components/chrome/Chrome'

import input from '../../config/input.js'

function formatColor(color) {
  const rgb = color.rgb
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
}

/*** Number fields with support for min, max and units and documentation*/
class ColorField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    default: React.PropTypes.number,
    doc: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      pickerOpened: false
    }
  }

  togglePicker() {
    this.setState({ pickerOpened: !this.state.pickerOpened })
  }

  render() {
    const picker = <div style={{
        position: 'absolute',
        left: 163,
        top: 0,
      }}>
      <ChromePicker
        color={this.props.value ? Color(this.props.value).object() : null}
        onChange={c => this.props.onChange(formatColor(c))}
      />
      <div
        onClick={this.togglePicker.bind(this)}
        style={{
          zIndex: -1,
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        }} />
    </div>

    return <div style={{
      ...input.property,
      position: 'relative',
      display: 'inline',
    }}>
      {this.state.pickerOpened && picker}
      <input
        onClick={this.togglePicker.bind(this)}
        style={{
          ...input.select,
          ...this.props.style
        }}
        name={this.props.name}
        placeholder={this.props.default}
        value={this.props.value ? this.props.value : ""}
        onChange={(e) => this.props.onChange(e.target.value)}
      />
    </div>
  }
}

export default ColorField
