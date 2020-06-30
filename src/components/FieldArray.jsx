import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputArray from './InputArray'
import Fieldset from './Fieldset'

export default class FieldArray extends React.Component {
  static propTypes = {
    ...InputArray.propTypes,
    name: PropTypes.string,
  }

  render() {
    const {props} = this;

    return <Fieldset label={props.label}>
      <InputArray {...props} />
    </Fieldset>
  }
}

