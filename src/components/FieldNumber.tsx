import React from 'react'
import InputNumber, {InputNumberProps} from './InputNumber'
import Block from './Block'


type FieldNumberProps = InputNumberProps & {
  label?: string
  fieldSpec?: {
    doc: string
  }
};


export default class FieldNumber extends React.Component<FieldNumberProps> {
  render() {
    return <Block label={this.props.label} fieldSpec={this.props.fieldSpec}>
      <InputNumber {...this.props} />
    </Block>
  }
}
