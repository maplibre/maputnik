import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import Block from './Block'
import FieldAutocomplete from './FieldAutocomplete'

export default class BlockSource extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    wdKey: PropTypes.string,
    onChange: PropTypes.func,
    sourceIds: PropTypes.array,
    error: PropTypes.object,
  }

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
        onChange={this.props.onChange}
        options={this.props.sourceIds.map(src => [src, src])}
      />
    </Block>
  }
}

