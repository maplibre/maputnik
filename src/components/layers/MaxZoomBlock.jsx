import React from 'react'
import PropTypes from 'prop-types'

import * as styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
import InputBlock from '../inputs/InputBlock'
import NumberInput from '../inputs/NumberInput'

class MaxZoomBlock extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Max Zoom"} doc={styleSpec.latest.layer.maxzoom.doc}
      data-wd-key="max-zoom"
    >
      <NumberInput
        value={this.props.value}
        onChange={this.props.onChange}
        min={styleSpec.latest.layer.maxzoom.minimum}
        max={styleSpec.latest.layer.maxzoom.maximum}
        default={styleSpec.latest.layer.maxzoom.maximum}
      />
    </InputBlock>
  }
}

export default MaxZoomBlock
