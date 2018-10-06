import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import SelectInput from '../inputs/SelectInput'

class LayerTypeBlock extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    wdKey: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"Type"} doc={latest.layer.type.doc}
      data-wd-key={this.props.wdKey}
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
          ['hillshade', 'Hillshade'],
          ['heatmap', 'Heatmap'],
        ]}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    </InputBlock>
  }
}

export default LayerTypeBlock
