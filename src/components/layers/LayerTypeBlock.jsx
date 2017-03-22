import React from 'react'

import GlSpec from 'mapbox-gl/src/style-spec/reference/latest'
import InputBlock from '../inputs/InputBlock'
import SelectInput from '../inputs/SelectInput'

class LayerTypeBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Type"} doc={GlSpec.layer.type.doc}>
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
