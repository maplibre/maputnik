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
  const {
    t,
    disabled = false,
    value,
    wdKey,
    onChange,
    error,
  } = props;
  return (
    <Block label={t('Type')} fieldSpec={latest.layer.type}
      data-wd-key={wdKey}
      error={error}
    >
      {disabled && (
        <InputString value={value} disabled={true} />
      )}
      {!disabled && (
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
          onChange={onChange}
          value={value}
          data-wd-key={wdKey + '.select'}
        />
      )}
    </Block>
  );
};

const FieldType = withTranslation()(FieldTypeInternal);
export default FieldType;
