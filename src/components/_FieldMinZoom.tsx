import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldNumber from './FieldNumber'

type BlockMinZoomProps = {
  value?: number
  onChange(...args: unknown[]): unknown
  error?: unknown[]
};

export default class BlockMinZoom extends React.Component<BlockMinZoomProps> {
  render() {
    return <Block label={"Min Zoom"} fieldSpec={latest.layer.minzoom}
      error={this.props.error}
      data-wd-key="min-zoom"
    >
      <FieldNumber
        allowRange={true}
        value={this.props.value}
        onChange={this.props.onChange}
        min={latest.layer.minzoom.minimum}
        max={latest.layer.minzoom.maximum}
        default={latest.layer.minzoom.minimum}
      />
    </Block>
  }
}

