import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputMultiInput from './InputMultiInput'
import Fieldset from './Fieldset'


export default class FieldMultiInput extends React.Component {
  static propTypes = {
    ...InputMultiInput.propTypes,
  }

  render() {
    const {props} = this;

    return <Fieldset label={props.label}>
      <InputMultiInput {...props} />
    </Fieldset>
  }
}

