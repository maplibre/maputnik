import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldSourceLayerInternalProps = {
  value?: string
  onChange?(...args: unknown[]): unknown
  sourceLayerIds?: unknown[]
  isFixed?: boolean
  error?: {message: string}
} & WithTranslation;

class FieldSourceLayerInternal extends React.Component<FieldSourceLayerInternalProps> {
  static defaultProps = {
    onChange: () => {},
    sourceLayerIds: [],
    isFixed: false
  }

  render() {
    const t = this.props.t;
    return <Block
      label={t("Source Layer")}
      fieldSpec={latest.layer['source-layer']}
      data-wd-key="layer-source-layer"
      error={this.props.error}
    >
      <InputAutocomplete
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceLayerIds?.map(l => [l, l])}
      />
    </Block>
  }
}

const FieldSourceLayer = withTranslation()(FieldSourceLayerInternal);
export default FieldSourceLayer;
