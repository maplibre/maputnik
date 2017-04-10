import React from 'react'

import styleSpec from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

class LayerIdBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"ID"} doc={styleSpec.latest.layer.id.doc}>
      <StringInput
        value={this.props.value}
        onChange={this.props.onChange}
      />
    </InputBlock>
  }
}

export default LayerIdBlock
