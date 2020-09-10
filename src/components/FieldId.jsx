import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import Block from './Block'
import InputString from './InputString'

export default class FieldId extends React.Component {
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
      <InputString
        value={this.props.value}
        onInput={this.props.onChange}
      />
    </Block>
  }
}
