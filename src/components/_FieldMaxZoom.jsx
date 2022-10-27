import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldNumber from './FieldNumber'

export default class BlockMaxZoom extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.object,
  }

  render() {
    return <Block label={"Max Zoom"} fieldSpec={latest.layer.maxzoom}
      error={this.props.error}
      data-wd-key="max-zoom"
    >
      <FieldNumber
        allowRange={true}
        value={this.props.value}
        onChange={this.props.onChange}
        min={latest.layer.maxzoom.minimum}
        max={latest.layer.maxzoom.maximum}
        default={latest.layer.maxzoom.maximum}
      />
    </Block>
  }
}

