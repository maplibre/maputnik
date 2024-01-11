import React from 'react'

import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import Block from './Block'
import InputSelect from './InputSelect'
import InputString from './InputString'

type FieldTypeProps = {
  value: string
  wdKey?: string
  onChange(value: string): unknown
  error?: {message: string}
  disabled?: boolean
};

export default class FieldType extends React.Component<FieldTypeProps> {
  static defaultProps = {
    disabled: false,
  }

  render() {
    return <Block label={"Type"} fieldSpec={latest.layer.type}
      data-wd-key={this.props.wdKey}
      error={this.props.error}
    >
      {this.props.disabled &&
        <InputString
          value={this.props.value}
          disabled={true}
        />
      }
      {!this.props.disabled &&
        <InputSelect
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
          data-wd-key={this.props.wdKey + ".select"}
        />
      }
    </Block>
  }
}
