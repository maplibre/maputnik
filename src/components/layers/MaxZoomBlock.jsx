import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import NumberInput from '../inputs/NumberInput'

class MaxZoomBlock extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Max Zoom"} doc={latest.layer.maxzoom.doc}
      data-wd-key="max-zoom"
    >
      <NumberInput
        value={this.props.value}
        onChange={this.props.onChange}
        min={latest.layer.maxzoom.minimum}
        max={latest.layer.maxzoom.maximum}
        default={latest.layer.maxzoom.maximum}
      />
    </InputBlock>
  }
}

export default MaxZoomBlock
