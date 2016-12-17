import React from 'react'
import Immutable from 'immutable'
import color from 'color'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'
import NumberField from './number'
import EnumField from './enum'
import ColorField from './color'
import StringField from './string'
import inputStyle from './input.js'
import theme from '../theme.js'

function isZoomField(value) {
  return Immutable.Map.isMap(value)
}

const specFieldProps =  {
  onChange: React.PropTypes.func.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  fieldSpec: React.PropTypes.object.isRequired,
}

/** Supports displaying spec field for zoom function objects
 * https://www.mapbox.com/mapbox-gl-style-spec/#types-function-zoom-property
 */
class ZoomSpecField extends React.Component {
  static propTypes = {
    ...specFieldProps,
    value: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
  }

  render() {
    if(isZoomField(this.props.value)) {
      const zoomFields = this.props.value.get('stops').map(stop => {
        const zoomLevel = stop.get(0)
        const value = stop.get(1)

        return <div key={zoomLevel}>
          <b><span style={inputStyle.label}>Zoom Level {zoomLevel}</span></b>
          <SpecField {...this.props} value={value} />
        </div>
      }).toSeq()
      return <div style={{
          border: 1,
          borderStyle: 'solid',
          borderColor: color(theme.colors.gray).lighten(0.1).hexString(),
          padding: theme.scale[1],
        }}>
        {zoomFields}
      </div>
    } else {
      return <SpecField {...this.props} />
    }
  }
}

function labelFromFieldName(fieldName) {
  let label = fieldName.split('-').slice(1).join(' ')
  if(label.length > 0) {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }
  return label
}

/** Display any field from the Mapbox GL style spec and
 * choose the correct field component based on the @{fieldSpec}
 * to display @{value}. */
class SpecField extends React.Component {
  static propTypes = {
    ...specFieldProps,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
  }

  onValueChanged(property, value) {
    return this.props.onChange(property, value)
  }

  render() {
    const label = labelFromFieldName(this.props.fieldName)
    switch(this.props.fieldSpec.type) {
      case 'number': return (
        <NumberField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={label}
          default={this.props.fieldSpec.default}
          min={this.props.fieldSpec.min}
          max={this.props.fieldSpec.max}
          unit={this.props.fieldSpec.unit}
          doc={this.props.fieldSpec.doc}
        />
      )
      case 'enum': return (
        <EnumField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={label}
          allowedValues={this.props.fieldSpec.values}
          doc={this.props.fieldSpec.doc}
        />
      )
      case 'string': return (
        <StringField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={label}
          doc={this.props.fieldSpec.doc}
        />
      )
      case 'color': return (
        <ColorField
          onChange={this.onValueChanged.bind(this, this.props.fieldName)}
          value={this.props.value}
          name={label}
          doc={this.props.fieldSpec.doc}
        />
      )
      default: return null
    }
  }
}

export class PropertyGroup extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    properties: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    layerType: React.PropTypes.oneOf(['fill', 'background', 'line', 'symbol']).isRequired,
    groupType: React.PropTypes.oneOf(['paint', 'layout']).isRequired,
  }

  render() {
    const layerTypeSpec = GlSpec[this.props.groupType + "_" + this.props.layerType]
    const specFields = Object.keys(layerTypeSpec).filter(propName => propName !== 'visibility').map(propName => {
      const fieldSpec = layerTypeSpec[propName]
      const propValue = this.props.properties.get(propName)
      return <ZoomSpecField
        onChange={this.props.onChange}
        key={propName}
        value={propValue}
        fieldName={propName}
        fieldSpec={fieldSpec}
      />
    })
    return <div>
      {specFields}
    </div>
  }
}
