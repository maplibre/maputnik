import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputNumber from './InputNumber'

type FieldMinZoomProps = {
  value?: number
  onChange(...args: unknown[]): unknown
  error?: {message: string}
};

export default class FieldMinZoom extends React.Component<FieldMinZoomProps> {
  render() {
    return <Block label={"Min Zoom"} fieldSpec={latest.layer.minzoom}
      error={this.props.error}
      data-wd-key="min-zoom"
    >
      <InputNumber
        allowRange={true}
        value={this.props.value}
        onChange={this.props.onChange}
        min={latest.layer.minzoom.minimum}
        max={latest.layer.minzoom.maximum}
        default={latest.layer.minzoom.minimum}
        data-wd-key='min-zoom.input'
      />
    </Block>
  }
}
