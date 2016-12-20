import React from 'react'
import Color from 'color'

import NumberField from './NumberField'
import EnumField from './EnumField'
import BooleanField from './BooleanField'
import ColorField from './ColorField'
import StringField from './StringField'
import SpecField from './SpecField'

import input from '../../config/input.js'
import colors from '../../config/colors.js'
import { margins } from '../../config/scales.js'

function isZoomField(value) {
  return typeof value === 'object' && value.stops
}

const specFieldProps =  {
  onChange: React.PropTypes.func.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  fieldSpec: React.PropTypes.object.isRequired,
}

/** Supports displaying spec field for zoom function objects
 * https://www.mapbox.com/mapbox-gl-style-spec/#types-function-zoom-property
 */
export default class ZoomSpecField extends React.Component {
  static propTypes = {
      onChange: React.PropTypes.func.isRequired,
      fieldName: React.PropTypes.string.isRequired,
      fieldSpec: React.PropTypes.object.isRequired,

      value: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool,
    ]),
  }

  render() {
    const label = <label style={input.label}>
      {labelFromFieldName(this.props.fieldName)}
    </label>

    if(isZoomField(this.props.value)) {
      const zoomFields = this.props.value.stops.map(stop => {
        const zoomLevel = stop[0]
        const value = stop[1]

        return <div style={input.property} key={zoomLevel}>
          {label}
          <SpecField {...this.props}
            value={value}
            style={{
              width: '33%'
            }}
          />

          <input
            style={{
              ...input.input,
              width: '10%',
              marginLeft: margins[0],
            }}
            type="number"
            value={zoomLevel}
            min={0}
            max={22}
          />
        </div>
      })
      return <div style={{
          border: 1,
          borderStyle: 'solid',
          borderColor: Color(colors.gray).lighten(0.1).string(),
          padding: margins[1],
        }}>
        {zoomFields}
      </div>
    } else {
      return <div style={input.property}>
        {label}
        <SpecField {...this.props} />
      </div>
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
