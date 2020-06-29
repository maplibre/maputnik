import React from 'react'
import PropTypes from 'prop-types'
import Block from './Block'
import InputSpec from './InputSpec'
import Fieldset from './Fieldset'


const typeMap = {
  color: () => Block,
  enum: ({fieldSpec}) => (Object.keys(fieldSpec.values).length <= 3 ? Fieldset : Block),
  number: () => Block,
  boolean: () => Block,
  array: () => Fieldset,
  resolvedImage: () => Block,
  number: () => Block,
  string: () => Block,
  formatted: () => Block,
};

export default class SpecField extends React.Component {
  static propTypes = {
    ...InputSpec.propTypes,
    name: PropTypes.string,
  }

  render() {
    const {props} = this;

    const fieldType = props.fieldSpec.type;

    const typeBlockFn = typeMap[fieldType];

    let TypeBlock;
    if (typeBlockFn) {
      TypeBlock = typeBlockFn(props);
    }
    else {
      console.warn("No such type for '%s'", fieldType);
      TypeBlock = Block;
    }

    return <TypeBlock
      label={props.label}
      action={props.action}
      fieldSpec={this.props.fieldSpec}
    >
      <InputSpec {...props} />
    </TypeBlock>
  }
}

