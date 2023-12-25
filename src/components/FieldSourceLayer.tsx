import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'

type FieldSourceLayerProps = {
  value?: string
  onChange?(...args: unknown[]): unknown
  sourceLayerIds?: unknown[]
  isFixed?: boolean
  error?: {message: string}
};

export default class FieldSourceLayer extends React.Component<FieldSourceLayerProps> {
  static defaultProps = {
    onChange: () => {},
    sourceLayerIds: [],
    isFixed: false
  }

  render() {
    return <Block 
      label={"Source Layer"} 
      fieldSpec={latest.layer['source-layer']}
      data-wd-key="layer-source-layer"
      error={this.props.error}
    >
      <InputAutocomplete
        keepMenuWithinWindowBounds={!!this.props.isFixed}
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceLayerIds?.map(l => [l, l])}
      />
    </Block>
  }
}
