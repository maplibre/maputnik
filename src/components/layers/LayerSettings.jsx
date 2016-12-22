import React from 'react'
import GlSpec from 'mapbox-gl-style-spec/reference/latest.min.js'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'

import colors from '../../config/colors'
import { margins } from '../../config/scales'


class LayerSettings extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(Object.keys(GlSpec.layer.type.values)).isRequired,
    onIdChange: React.PropTypes.func.isRequired,
    onTypeChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <div style={{
      padding: margins[2],
      paddingRight: 0,
      backgroundColor: colors.black,
      marginBottom: margins[2],
    }}>
      <InputBlock label={"Layer ID"}>
        <StringInput
          value={this.props.id}
          onChange={this.props.onIdChange}
        />
      </InputBlock>
      <InputBlock label={"Layer Type"}>
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
          onChange={this.props.onTypeChange}
          value={this.props.type}
        />
      </InputBlock>
    </div>
  }
}

export default LayerSettings
