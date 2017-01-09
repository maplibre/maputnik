
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
    let options = this.props.options
    if(options.length > 0 && !Array.isArray(options[0])) {
      options = options.map(v => [v, v])
    }

    const selectedValue = this.props.value || options[0][0]
    const buttons = options.map(([val, label])=> {
      return <Button
        key={val}
        onClick={e => this.props.onChange(val)}
        style={{
          marginRight: margins[0],
          backgroundColor: val === selectedValue ? colors.midgray : colors.gray,
        }}
      >
        {label}
      </Button>
    })

    return <div style={{
      display: 'inline-block',
      ...this.props.style,
    }}>
      {buttons}
    </div>
  }
}

export default MultiButtonInput
