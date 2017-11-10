import React from 'react'
import PropTypes from 'prop-types'

import styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
import InputBlock from '../inputs/InputBlock'
import NumberInput from '../inputs/NumberInput'

class MinZoomBlock extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Min Zoom"} doc={styleSpec.latest.layer.minzoom.doc}
      data-wd-key="min-zoom"
    >
      <NumberInput
        value={this.props.value}
        onChange={this.props.onChange}
        min={styleSpec.latest.layer.minzoom.minimum}
        max={styleSpec.latest.layer.minzoom.maximum}
        default={styleSpec.latest.layer.minzoom.minimum}
      />
    </InputBlock>
  }
}

export default MinZoomBlock
