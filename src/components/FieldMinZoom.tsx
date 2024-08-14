import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputNumber from './InputNumber'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldMinZoomInternalProps = {
  value?: number
  onChange(...args: unknown[]): unknown
  error?: {message: string}
} & WithTranslation;

class FieldMinZoomInternal extends React.Component<FieldMinZoomInternalProps> {
  render() {
    const t = this.props.t;
    return <Block label={t("Min Zoom")} fieldSpec={latest.layer.minzoom}
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

const FieldMinZoom = withTranslation()(FieldMinZoomInternal);
export default FieldMinZoom;
