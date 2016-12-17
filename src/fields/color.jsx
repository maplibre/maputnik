import React from 'react'
import inputStyle from './input.js'
import ColorPicker from 'react-colorpickr'
import 'react-colorpickr/dist/colorpickr.css'

function formatColor(color) {
  if(color.a !== 1) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  }
  return `rgb(${color.r}, ${color.g}, ${color.b})`
}

/*** Number fields with support for min, max and units and documentation*/
class ColorField extends React.Component {
static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    default: React.PropTypes.number,
    doc: React.PropTypes.string,
  }

  render() {
    return <div style={{...inputStyle.property, position: 'relative'}}>
      <div style={{
        position: 'absolute',
        left: 200
      }}>
        <ColorPicker
          value={this.props.value}
          onChange={c => this.props.onChange(formatColor(c))}
        />
      </div>

      <label style={inputStyle.label}>{this.props.name}</label>
      <input
        style={inputStyle.input}
        name={this.props.name}
        placeholder={this.props.default}
        value={this.props.value ? this.props.value : ""}
        onChange={(e) => this.props.onChange(e.target.value)}
      />
    </div>
  }
}

export default ColorField
