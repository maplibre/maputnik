import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldNumber from './FieldNumber'

type BlockMaxZoomProps = {
  value?: number
  onChange(...args: unknown[]): unknown
  error?: unknown[]
};

export default class BlockMaxZoom extends React.Component<BlockMaxZoomProps> {
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

