import React from 'react'

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import AutocompleteInput from '../inputs/AutocompleteInput'

class LayerSourceBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    sourceIds: React.PropTypes.array,
  }

  static defaultProps = {
    onChange: () => {},
    sourceIds: [],
  }

  render() {
    return <InputBlock label={"Source"}>
      <AutocompleteInput
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceIds.map(src => [src, src])}
        wrapperStyle={{ width: '50%' }}
      />
    </InputBlock>
  }
}

export default LayerSourceBlock
