import React from 'react'

import GlSpec from 'mapbox-gl-style-spec/reference/latest.js'
import InputBlock from '../inputs/InputBlock'
import NumberInput from '../inputs/NumberInput'

class MaxZoomBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Max Zoom"} doc={GlSpec.layer.maxzoom.doc}
      data-wd-key="max-zoom"
    >
      <NumberInput
        value={this.props.value}
        onChange={this.props.onChange}
        min={GlSpec.layer.maxzoom.minimum}
        max={GlSpec.layer.maxzoom.maximum}
        default={GlSpec.layer.maxzoom.maximum}
      />
    </InputBlock>
  }
}

export default MaxZoomBlock
