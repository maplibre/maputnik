import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputNumber from './InputNumber'

type FieldMaxZoomProps = {
  value?: number
  onChange(...args: unknown[]): unknown
  error?: unknown[]
};

export default class FieldMaxZoom extends React.Component<FieldMaxZoomProps> {
  render() {
    return <Block label={"Max Zoom"} fieldSpec={latest.layer.maxzoom}
      error={this.props.error}
      data-wd-key="max-zoom"
    >
      <InputNumber
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
