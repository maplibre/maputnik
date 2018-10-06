import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import AutocompleteInput from '../inputs/AutocompleteInput'

class LayerSourceLayer extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    sourceLayerIds: PropTypes.array,
    isFixed: PropTypes.bool,
  }

  static defaultProps = {
    onChange: () => {},
    sourceLayerIds: [],
    isFixed: false
  }

  render() {
    return <InputBlock label={"Source Layer"} doc={latest.layer['source-layer'].doc}
      data-wd-key="layer-source-layer"
    >
      <AutocompleteInput
        keepMenuWithinWindowBounds={!!this.props.isFixed}
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceLayerIds.map(l => [l, l])}
      />
    </InputBlock>
  }
}

export default LayerSourceLayer
