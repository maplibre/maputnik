import React from 'react'
import PropTypes from 'prop-types'

import styleSpec from '@mapbox/mapbox-gl-style-spec/style-spec'
import InputBlock from '../inputs/InputBlock'
import SelectInput from '../inputs/SelectInput'

class LayerTypeBlock extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Type"} doc={styleSpec.latest.layer.type.doc}
      data-wd-key="layer-type"
    >
      <SelectInput
        options={[
          ['background', 'Background'],
          ['fill', 'Fill'],
          ['line', 'Line'],
          ['symbol', 'Symbol'],
          ['raster', 'Raster'],
          ['circle', 'Circle'],
          ['fill-extrusion', 'Fill Extrusion'],
        ]}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    </InputBlock>
  }
}

export default LayerTypeBlock
