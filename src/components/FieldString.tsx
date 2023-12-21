import React from 'react'
import Block from './Block'
import InputString, {InputStringProps} from './InputString'

type FieldStringProps = InputStringProps & {
  name?: string
  label?: string
};

export default class FieldString extends React.Component<FieldStringProps> {
  render() {
    const {props} = this;

    return <Block label={props.label}>
      <InputString {...props} />
    </Block>
  }
}
