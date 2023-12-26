import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldString from './FieldString'

type BlockIdProps = {
  value: string
  wdKey: string
  onChange(...args: unknown[]): unknown
  error?: {message: string}
};

export default class BlockId extends React.Component<BlockIdProps> {
  render() {
    return <Block label={"ID"} fieldSpec={latest.layer.id}
      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      <FieldString
        value={this.props.value}
        onChange={this.props.onChange}
      />
    </Block>
  }
}

