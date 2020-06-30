import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputAutocomplete from './InputAutocomplete'


export default class FieldAutocomplete extends React.Component {
  static propTypes = {
    ...InputAutocomplete.propTypes,
  }

  render() {
    const {props} = this;

    return <Block label={props.label}>
      <InputAutocomplete {...props} />
    </Block>
  }
}

