import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputSelect from './InputSelect'
import InputString from './InputString'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldTypeInternalProps = {
  value: string
  wdKey?: string
  onChange(value: string): unknown
  error?: {message: string}
  disabled?: boolean
} & WithTranslation;

const FieldTypeInternal: React.FC<FieldTypeInternalProps> = (props) => {
  const t = props.t;
  return (
    <Block label={t('Type')} fieldSpec={latest.layer.type}
      data-wd-key={props.wdKey}
      error={props.error}
    >
      {props.disabled && (
        <InputString value={props.value} disabled={true} />
      )}
      {!props.disabled && (
        <InputSelect
          options={[
            ['background', 'Background'],
            ['fill', 'Fill'],
            ['line', 'Line'],
            ['symbol', 'Symbol'],
            ['raster', 'Raster'],
            ['circle', 'Circle'],
            ['fill-extrusion', 'Fill Extrusion'],
            ['hillshade', 'Hillshade'],
            ['heatmap', 'Heatmap'],
          ]}
          onChange={props.onChange}
          value={props.value}
          data-wd-key={props.wdKey + '.select'}
        />
      )}
    </Block>
  );
};

FieldTypeInternal.defaultProps = {
  disabled: false,
};

const FieldType = withTranslation()(FieldTypeInternal);
export default FieldType;
