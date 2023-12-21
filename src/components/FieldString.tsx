import React from 'react'
import Block from './Block'
import InputString, {InputStringProps} from './InputString'

type FieldStringProps = InputStringProps & {
  name?: string
  label?: string
  fieldSpec?: {
    doc: string
  }
};

export default class FieldString extends React.Component<FieldStringProps> {
  render() {
    return <Block label={this.props.label} fieldSpec={this.props.fieldSpec}>
      <InputString {...this.props} />
    </Block>
  }
}
