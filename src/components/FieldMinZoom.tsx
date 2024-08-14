import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputNumber from './InputNumber'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldMinZoomProps = {
  value?: number
  onChange(...args: unknown[]): unknown
  error?: {message: string}
};

class IFieldMinZoom extends React.Component<FieldMinZoomProps & WithTranslation> {
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

const FieldMinZoom = withTranslation()(IFieldMinZoom);
export default FieldMinZoom;
