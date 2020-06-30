import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputCheckbox from './InputCheckbox'


export default class FieldCheckbox extends React.Component {
  static propTypes = {
    ...InputCheckbox.propTypes,
  }

  render() {
    const {props} = this;

    return <Block label={this.props.label}>
      <InputCheckbox {...props} />
    </Block>
  }
}

