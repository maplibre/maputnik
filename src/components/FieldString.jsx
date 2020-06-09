import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputString from './InputString'

export default class FieldString extends React.Component {
  static propTypes = {
    ...InputString.propTypes,
    name: PropTypes.string,
  }

  render() {
    const {props} = this;

    return <Block label={props.label}>
      <InputString {...props} />
    </Block>
  }
}

