import React from 'react'
import inputStyle from './input.js'
import { getColor } from 'react-colorpickr/dist/colorfunc'
import { ChromePicker } from 'react-color';

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
  }

  render() {
    return <div style={{...inputStyle.property, position: 'relative'}}>
      <div style={{
        position: 'absolute',
        left: 200
      }}>
        <ChromePicker
          color={getColor(this.props.value)}
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
