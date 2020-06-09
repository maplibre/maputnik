import React from 'react'
import PropTypes from 'prop-types'
import InputEnum from './InputEnum'
import Block from './Block';
import Fieldset from './Fieldset';


export default class FieldEnum extends React.Component {
  static propTypes = {
    ...InputEnum.propTypes,
  }

  render() {
    const {props} = this;

    return <Fieldset label={props.label}>
      <InputEnum {...props} />
    </Fieldset>
  }
}
