import React from 'react'
import SelectInput from '../inputs/SelectInput'

import { otherFilterOps } from '../../libs/filterops.js'
import { margins, fontSizes } from '../../config/scales.js'

class OperatorSelect extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <SelectInput
      style={{
        width: '15%',
        margin: margins[0]
      }}
      value={this.props.value}
      onChange={this.props.onChange}
      options={otherFilterOps.map(op => [op, op])}
    />
  }
}

export default OperatorSelect
