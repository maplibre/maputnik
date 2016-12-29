import React from 'react'

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'

class LayerSourceBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    sourceIds: React.PropTypes.array.isRequired,
  }

  render() {
    return <InputBlock label={"Source"}>
      <SelectInput
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceIds.map(s => [s, s])}
      />
    </InputBlock>
  }
}

export default LayerSourceBlock
