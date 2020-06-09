import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputColor from './InputColor'


export default class FieldColor extends React.Component {
  static propTypes = {
    ...InputColor.propTypes,
  }

  render() {
    const {props} = this;

    return <Block label={props.label}>
      <InputColor {...props} />
    </Block>
  }
}

