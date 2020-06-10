import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputSpec from './InputSpec'
import Fieldset from './Fieldset'


const typeMap = {
  color: Block,
  enum: Fieldset,
  number: Block,
  boolean: Block,
  array: Fieldset,
  resolvedImage: Block,
  number: Block,
  string: Block
};

export default class SpecField extends React.Component {
  static propTypes = {
    ...InputSpec.propTypes,
    name: PropTypes.string,
  }

  render() {
    const {props} = this;

    const fieldType = props.fieldSpec.type;
    let TypeBlock = typeMap[fieldType];

    if (!TypeBlock) {
      console.warn("No such type for '%s'", fieldType);
      TypeBlock = Block;
    }

    return <TypeBlock label={props.label} action={props.action}>
      <InputSpec {...props} />
    </TypeBlock>
  }
}

