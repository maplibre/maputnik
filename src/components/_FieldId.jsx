import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@maplibre/maplibre-gl-style-spec'
import Block from './Block'
import FieldString from './FieldString'

export default class BlockId extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    wdKey: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.object,
  }

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

