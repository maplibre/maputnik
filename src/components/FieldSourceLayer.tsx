import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'
import { WithTranslation, withTranslation } from 'react-i18next';

export const NON_SOURCE_LAYERS = ['background', 'raster', 'hillshade', 'heatmap', 'color-relief']

type FieldSourceLayerInternalProps = {
  value?: string
  onChange?(...args: unknown[]): unknown
  sourceLayerIds?: unknown[]
  isFixed?: boolean
  error?: {message: string}
} & WithTranslation;

const FieldSourceLayerInternal: React.FC<FieldSourceLayerInternalProps> = (props) => {
  const t = props.t;
  return (
    <Block
      label={t('Source Layer')}
      fieldSpec={latest.layer['source-layer']}
      data-wd-key="layer-source-layer"
      error={props.error}
    >
      <InputAutocomplete
        value={props.value}
        onChange={props.onChange}
        options={props.sourceLayerIds?.map((l) => [l, l])}
      />
    </Block>
  );
};

FieldSourceLayerInternal.defaultProps = {
  onChange: () => {},
  sourceLayerIds: [],
  isFixed: false,
};

const FieldSourceLayer = withTranslation()(FieldSourceLayerInternal);
export default FieldSourceLayer;
