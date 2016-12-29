import React from 'react'
import input from '../../config/input.js'
import StringInput from './StringInput'
import NumberInput from './StringInput'

import { margins } from '../../config/scales.js'

class ArrayInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.array,
    type: React.PropTypes.string,
    length: React.PropTypes.number,
    default: React.PropTypes.array,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func,
  }

  render() {
    const values = this.props.value || this.props.default || []
    const commonStyle = {
      width: '15%',
      marginRight: margins[0],
    }
    const inputs = values.map((v, i) => {
      if(this.props.type === 'number') {
        return <NumberInput key={i} value={v} style={commonStyle} />
      }
      return <StringInput key={i} value={v} style={commonStyle} />
    })

    return <div style={{display: 'inline-block', width: '51%'}}>
      {inputs}
    </div>
  }
}

export default ArrayInput
