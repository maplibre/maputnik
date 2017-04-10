import React from 'react'

import styleSpec from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import NumberInput from '../inputs/NumberInput'

class MinZoomBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Min Zoom"} doc={styleSpec.latest.layer.minzoom.doc}>
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
