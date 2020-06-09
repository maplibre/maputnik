import React from 'react'
import PropTypes from 'prop-types'
import InputNumber from './InputNumber'
import Block from './Block'


export default class FieldNumber extends React.Component {
  static propTypes = {
    ...InputNumber.propTypes,
  }

  render() {
    const {props} = this;
    return <Block label={props.label}>
      <InputNumber {...props} />
    </Block>
  }
}

