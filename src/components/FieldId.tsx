import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputString from './InputString'

type FieldIdProps = {
  value: string
  wdKey: string
  onChange(...args: unknown[]): unknown
  error?: unknown[]
};

export default class FieldId extends React.Component<FieldIdProps> {
  render() {
    return <Block label={"ID"} fieldSpec={latest.layer.id}
      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      <InputString
        value={this.props.value}
        onInput={this.props.onChange}
      />
    </Block>
  }
}
