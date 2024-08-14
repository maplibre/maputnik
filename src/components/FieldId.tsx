import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputString from './InputString'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldIdProps = {
  value: string
  wdKey: string
  onChange(value: string | undefined): unknown
  error?: {message: string}
};

class IFieldId extends React.Component<FieldIdProps & WithTranslation> {
  render() {
    const t = this.props.t;
    return <Block label={t("ID")} fieldSpec={latest.layer.id}

      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      <InputString
        value={this.props.value}
        onInput={this.props.onChange}
        data-wd-key={this.props.wdKey + ".input"}
      />
    </Block>
  }
}

const FieldId = withTranslation()(IFieldId);
export default FieldId;
