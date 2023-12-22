import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'

type FieldSourceProps = {
  value?: string
  wdKey?: string
  onChange?(...args: unknown[]): unknown
  sourceIds?: unknown[]
  error?: unknown[]
};

export default class FieldSource extends React.Component<FieldSourceProps> {
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
      <InputAutocomplete
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceIds?.map(src => [src, src])}
      />
    </Block>
  }
}
