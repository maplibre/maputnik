import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import SelectInput from '../inputs/SelectInput'
import StringInput from '../inputs/StringInput'

class LayerTypeBlock extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    wdKey: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.object,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
  }

  render() {
    return <InputBlock label={"Type"} fieldSpec={latest.layer.type}
      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      {this.props.disabled &&
        <StringInput
          value={this.props.value}
          disabled={true}
        />
      }
      {!this.props.disabled &&
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
      }
    </InputBlock>
  }
}

export default LayerTypeBlock
