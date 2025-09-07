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

const FieldTypeInternal: React.FC<FieldTypeInternalProps> = (props) => {
  const t = props.t;
  const layerstypes: [string, string][] = Object.keys(v8.layer.type.values || {}).map(v => [v, startCase(v.replace(/-/g, ' '))]);
  return (
    <Block label={t('Type')} fieldSpec={v8.layer.type}
      data-wd-key={props.wdKey}
      error={props.error}
    >
      {props.disabled && (
        <InputString value={props.value} disabled={true} />
      )}
      {!props.disabled && (
        <InputSelect
          options={layerstypes}
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
