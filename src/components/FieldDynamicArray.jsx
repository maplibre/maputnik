import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputDynamicArray from './InputDynamicArray'
import Fieldset from './Fieldset'

export default class FieldDynamicArray extends React.Component {
  static propTypes = {
    ...InputDynamicArray.propTypes,
    name: PropTypes.string,
  }

  render() {
    const {props} = this;

    return <Fieldset label={props.label}>
      <InputDynamicArray {...props} />
    </Fieldset>
  }
}

