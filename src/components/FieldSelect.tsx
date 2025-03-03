import React from 'react'
import Block from './Block'
import InputSelect, {InputSelectProps} from './InputSelect'


type FieldSelectProps = InputSelectProps & {
  label?: string
  fieldSpec?: {
    doc: string
  }
};


export default class FieldSelect extends React.Component<FieldSelectProps> {
  render() {
    return <Block label={this.props.label} fieldSpec={this.props.fieldSpec}>
      <InputSelect {...this.props}/>
    </Block>
  }
}
