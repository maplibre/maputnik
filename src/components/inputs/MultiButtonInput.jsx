
import React from 'react'
import Button from '../Button'

import colors from '../../config/colors'
import { margins } from '../../config/scales'
import input from '../../config/input.js'

class MultiButtonInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    const selectedValue = this.props.value || this.props.options[0][0]
    const buttons = this.props.options.map(([val, label])=> {
      return <Button
        key={val}
        style={{
          marginRight: margins[0],
          backgroundColor: val === selectedValue ? colors.midgray : colors.gray,
        }}
        onClick={e => this.props.onChange(val)}
      >
        {label}
      </Button>
    })

    return <div style={{display: 'inline-block'}}>
      {buttons}
    </div>
  }
}

export default MultiButtonInput
