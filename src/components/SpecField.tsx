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
  padding: () => Block,
};

export type SpecFieldProps = InputFieldSpecProps & {
  name?: string
};

export default class SpecField extends React.Component<SpecFieldProps> {
  render() {
    const fieldType = this.props.fieldSpec?.type;

    const typeBlockFn = typeMap[fieldType!];

    let TypeBlock;
    if (typeBlockFn) {
      TypeBlock = typeBlockFn(this.props);
    }
    else {
      console.warn("No such type for '%s'", fieldType);
      TypeBlock = Block;
    }

    return <TypeBlock
      label={this.props.label}
      action={this.props.action}
      fieldSpec={this.props.fieldSpec}
    >
      <InputSpec {...this.props} />
    </TypeBlock>
  }
}

