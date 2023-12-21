import React from 'react'
import Block from './Block'
import InputSpec, { SpecFieldProps as InputFieldSpecProps } from './InputSpec'
import Fieldset from './Fieldset'


const typeMap = {
  color: () => Block,
  enum: ({fieldSpec}: any) => (Object.keys(fieldSpec.values).length <= 3 ? Fieldset : Block),
  boolean: () => Block,
  array: () => Fieldset,
  resolvedImage: () => Block,
  number: () => Block,
  string: () => Block,
  formatted: () => Block,
};

type SpecFieldProps = InputFieldSpecProps & {
  name?: string
};

export default class SpecField extends React.Component<SpecFieldProps> {
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

