import React from 'react'
import Block from './Block'
import InputColor, {InputColorProps} from './InputColor'


type FieldColorProps = InputColorProps & {
  label?: string
  fieldSpec?: {
    doc: string
  }
};


export default class FieldColor extends React.Component<FieldColorProps> {
  render() {
    return <Block label={this.props.label} fieldSpec={this.props.fieldSpec}>
      <InputColor {...this.props} />
    </Block>
  }
}
