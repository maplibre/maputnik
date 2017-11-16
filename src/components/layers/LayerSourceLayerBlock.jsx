import React from 'react'
import PropTypes from 'prop-types'

import styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import AutocompleteInput from '../inputs/AutocompleteInput'

class LayerSourceLayer extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    sourceLayerIds: PropTypes.array,
  }

  static defaultProps = {
    onChange: () => {},
    sourceLayerIds: [],
  }

  render() {
    return <InputBlock label={"Source Layer"} doc={styleSpec.latest.layer['source-layer'].doc}>
      <AutocompleteInput
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceLayerIds.map(l => [l, l])}
      />
    </InputBlock>
  }
}

export default LayerSourceLayer
