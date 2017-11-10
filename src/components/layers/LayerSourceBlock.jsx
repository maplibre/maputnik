import React from 'react'
import PropTypes from 'prop-types'

import styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import AutocompleteInput from '../inputs/AutocompleteInput'

class LayerSourceBlock extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    sourceIds: PropTypes.array,
  }

  static defaultProps = {
    onChange: () => {},
    sourceIds: [],
  }

  render() {
    return <InputBlock label={"Source"} doc={styleSpec.latest.layer.source.doc}
      data-wd-key="layer-source-block"
    >
      <AutocompleteInput
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceIds.map(src => [src, src])}
      />
    </InputBlock>
  }
}

export default LayerSourceBlock
