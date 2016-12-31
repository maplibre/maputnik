import React from 'react'
import Color from 'color'

import Button from '../Button'
import SpecField from './SpecField'
import NumberInput from '../inputs/NumberInput'
import DocLabel from './DocLabel'

import AddIcon from 'react-icons/lib/md/add-circle-outline'
import DeleteIcon from 'react-icons/lib/md/delete'

import capitalize from 'lodash.capitalize'
import input from '../../config/input.js'
import colors from '../../config/colors.js'
import { margins, fontSizes } from '../../config/scales.js'

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
    let label = <DocLabel
      label={labelFromFieldName(this.props.fieldName)}
      doc={this.props.fieldSpec.doc}
      style={{
        width: '50%',
      }}
    />

    if(isZoomField(this.props.value)) {
      const zoomFields = this.props.value.stops.map((stop, idx) => {
        label = <DocLabel
          doc={this.props.fieldSpec.doc}
          style={{ width: '42.5%'}}
          label={idx > 0 ? "" : labelFromFieldName(this.props.fieldName)}
        />

        if(idx === 1) {
          label = <label style={{...input.label, width: '42.5%'}}>
            <Button style={{fontSize: fontSizes[5]}}>
              Add stop
            </Button>
          </label>
        }

        const zoomLevel = stop[0]
        const value = stop[1]

        return <div key={zoomLevel} style={{
            ...input.property,
            marginLeft: 0,
            marginRight: 0
          }}>
          {label}
          <Button style={{backgroundColor: null}}>
            <DeleteIcon />
          </Button>
          <NumberInput
            style={{
              width: '7%',
            }}
            value={zoomLevel}
            min={0}
            max={22}
          />
          <SpecField {...this.props}
            value={value}
            style={{
              width: '42%',
              marginLeft: margins[0],
            }}
          />
        </div>
      })

      return <div style={input.property}>
        {zoomFields}
      </div>
    } else {
      return <div style={input.property}>
        {label}
        <SpecField {...this.props} style={{ width: '50%' } }/>
      </div>
    }
  }
}

function labelFromFieldName(fieldName) {
  let label = fieldName.split('-').slice(1).join(' ')
  return capitalize(label)
}
