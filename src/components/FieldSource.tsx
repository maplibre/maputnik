import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldSourceInternalProps = {
  value?: string
  wdKey?: string
  onChange?(value: string| undefined): unknown
  sourceIds?: unknown[]
  error?: {message: string}
} & WithTranslation;

const FieldSourceInternal: React.FC<FieldSourceInternalProps> = (props) => {
  const t = props.t;
  return (
    <Block
      label={t('Source')}
      fieldSpec={latest.layer.source}
      error={props.error}
      data-wd-key={props.wdKey}
    >
      <InputAutocomplete
        value={props.value}
        onChange={props.onChange}
        options={props.sourceIds?.map((src) => [src, src])}
      />
    </Block>
  );
};

FieldSourceInternal.defaultProps = {
  onChange: () => {},
  sourceIds: [],
};

const FieldSource = withTranslation()(FieldSourceInternal);
export default FieldSource;
