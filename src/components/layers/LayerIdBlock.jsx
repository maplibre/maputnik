import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

class LayerIdBlock extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    wdKey: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"ID"} doc={latest.layer.id.doc}
      data-wd-key={this.props.wdKey}
    >
      <StringInput
        value={this.props.value}
        onChange={this.props.onChange}
      />
    </InputBlock>
  }
}

export default LayerIdBlock
