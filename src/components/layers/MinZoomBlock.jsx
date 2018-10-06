import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import NumberInput from '../inputs/NumberInput'

class MinZoomBlock extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Min Zoom"} doc={latest.layer.minzoom.doc}
      data-wd-key="min-zoom"
    >
      <NumberInput
        value={this.props.value}
        onChange={this.props.onChange}
        min={latest.layer.minzoom.minimum}
        max={latest.layer.minzoom.maximum}
        default={latest.layer.minzoom.minimum}
      />
    </InputBlock>
  }
}

export default MinZoomBlock
