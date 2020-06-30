import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputSelect from './InputSelect'


export default class FieldSelect extends React.Component {
  static propTypes = {
    ...InputSelect.propTypes,
  }

  render() {
    const {props} = this;

    return <Block label={props.label}>
      <InputSelect {...props}/>
    </Block>
  }
}

