import React from 'react'
import PropTypes from 'prop-types'

import {latest} from '@mapbox/mapbox-gl-style-spec'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'

export default class FieldSourceLayer extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    sourceLayerIds: PropTypes.array,
    isFixed: PropTypes.bool,
  }

  static defaultProps = {
    onChange: () => {},
    sourceLayerIds: [],
    isFixed: false
  }

  render() {
    return <Block label={"Source Layer"} fieldSpec={latest.layer['source-layer']}
      data-wd-key="layer-source-layer"
    >
      <InputAutocomplete
        keepMenuWithinWindowBounds={!!this.props.isFixed}
        value={this.props.value}
        onChange={this.props.onChange}
        options={this.props.sourceLayerIds.map(l => [l, l])}
      />
    </Block>
  }
}
