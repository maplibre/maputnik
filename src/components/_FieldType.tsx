import React from 'react'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldSelect from './FieldSelect'
import FieldString from './FieldString'

type BlockTypeProps = {
  value: string
  wdKey?: string
  onChange(...args: unknown[]): unknown
  error?: unknown[]
  disabled?: boolean
};

export default class BlockType extends React.Component<BlockTypeProps> {
  static defaultProps = {
    disabled: false,
  }

  render() {
    return <Block label={"Type"} fieldSpec={latest.layer.type}
      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      {this.props.disabled &&
        <FieldString
          value={this.props.value}
          disabled={true}
        />
      }
      {!this.props.disabled &&
        <FieldSelect
          options={[
            ['background', 'Background'],
            ['fill', 'Fill'],
            ['line', 'Line'],
            ['symbol', 'Symbol'],
            ['raster', 'Raster'],
            ['circle', 'Circle'],
            ['fill-extrusion', 'Fill Extrusion'],
            ['hillshade', 'Hillshade'],
            ['heatmap', 'Heatmap'],
          ]}
          onChange={this.props.onChange}
          value={this.props.value}
        />
      }
    </Block>
  }
}

