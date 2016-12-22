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
    doc: React.PropTypes.string,
    style: React.PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      pickerOpened: false,
    }
  }

  //TODO: I much rather would do this with absolute positioning
  //but I am too stupid to get it to work together with fixed position
  //and scrollbars so I have to fallback to JavaScript
  calcPickerOffset() {
    const elem = this.refs.colorInput
    if(elem) {
      const pos = elem.getBoundingClientRect()
      return {
        top: pos.top,
        left: pos.left + 165,
      }
    } else {
      console.warn('Color field has no element to adjust position')
      return {
        top: 160,
        left: 500,
      }
    }
  }

  togglePicker() {
    this.setState({ pickerOpened: !this.state.pickerOpened })
  }

  get color() {
    return Color(this.props.value || '#fff')
  }

  render() {
    const offset = this.calcPickerOffset()
    const picker = <div
      style={{
        position: 'fixed',
        zIndex: 1,
        left: offset.left,
        top: offset.top,
      }}>
      <ChromePicker
        color={this.color.object()}
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
        }}
      />
    </div>

    return <div style={{
      ...input.property,
      position: 'relative',
      display: 'inline',
    }}>
      {this.state.pickerOpened && picker}
      <input
        ref="colorInput"
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
