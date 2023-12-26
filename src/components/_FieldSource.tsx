import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldAutocomplete from './FieldAutocomplete'

type BlockSourceProps = {
  value?: string
  wdKey?: string
  onChange?(...args: unknown[]): unknown
  sourceIds?: unknown[]
  error?: {message: string}
};

export default class BlockSource extends React.Component<BlockSourceProps> {
  static defaultProps = {
    onChange: () => {},
    sourceIds: [],
  }

  render() {
    return <Block
      label={"Source"}
      fieldSpec={latest.layer.source}
      error={this.props.error}
      data-wd-key={this.props.wdKey}
    >
      <FieldAutocomplete
        value={this.props.value}
        onChange={this.props.onChange!}
        options={this.props.sourceIds!.map(src => [src, src])}
      />
    </Block>
  }
}

