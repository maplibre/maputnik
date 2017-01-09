import React from 'react'
import SelectInput from '../inputs/SelectInput'

import input from '../../config/input.js'
import { margins } from '../../config/scales.js'

class CombiningOperatorSelect extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
  }

  render() {
    return <div style={{
      display: 'inline-block',
      width: '50%',
    }}>
      <SelectInput
        value={this.props.value}
        options={['all', 'any', 'none']}
        onChange={this.props.onChange}
        style={{
          display: 'block',
          width: '100%',
        }}
      />
      <label style={{
        ...input.label,
        width: 'auto',
        marginLeft: margins[2],
        display: 'block',
        width: '100%',
      }}>
        of the filters match
      </label>
    </div>
  }
}

export default CombiningOperatorSelect
