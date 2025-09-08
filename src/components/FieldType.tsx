import React from 'react'
import {v8} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputSelect from './InputSelect'
import InputString from './InputString'
import { WithTranslation, withTranslation } from 'react-i18next';
import { startCase } from 'lodash'

type FieldTypeInternalProps = {
  value: string
  wdKey?: string
  onChange(value: string): unknown
  error?: {message: string}
  disabled?: boolean
} & WithTranslation;

const FieldTypeInternal: React.FC<FieldTypeInternalProps> = ({
  t,
  value,
  wdKey,
  onChange,
  error,
  disabled = false
}) => {
  const layerstypes: [string, string][] = Object.keys(v8.layer.type.values || {}).map(v => [v, startCase(v.replace(/-/g, ' '))]);
  return (
    <Block label={t('Type')} fieldSpec={v8.layer.type}
      data-wd-key={wdKey}
      error={error}
    >
      {disabled && (
        <InputString value={value} disabled={true} />
      )}
      {!disabled && (
        <InputSelect
          options={layerstypes}
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
