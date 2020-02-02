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
  }

  render() {
    return <InputBlock label={"Type"} fieldSpec={latest.layer.type}
      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      <StringInput
        value={this.props.value}
        disabled={true}
      />
    </InputBlock>
  }
}

export default LayerTypeBlock
