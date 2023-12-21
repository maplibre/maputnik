import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldAutocomplete from './FieldAutocomplete'

type BlockSourceLayerProps = {
  value?: string
  onChange?(...args: unknown[]): unknown
  sourceLayerIds?: unknown[]
  isFixed?: boolean
};

export default class BlockSourceLayer extends React.Component<BlockSourceLayerProps> {
  static defaultProps = {
    onChange: () => {},
    sourceLayerIds: [],
    isFixed: false
  }

  render() {
    return <Block label={"Source Layer"} fieldSpec={latest.layer['source-layer']}
      data-wd-key="layer-source-layer"
    >
      <FieldAutocomplete
        keepMenuWithinWindowBounds={!!this.props.isFixed}
        value={this.props.value}
        onChange={this.props.onChange!}
        options={this.props.sourceLayerIds!.map(l => [l, l])}
      />
    </Block>
  }
}

