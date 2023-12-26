import React from 'react'
import Block from './Block'
import InputCheckbox, {InputCheckboxProps} from './InputCheckbox'


type FieldCheckboxProps = InputCheckboxProps & {
  label?: string;
};


export default class FieldCheckbox extends React.Component<FieldCheckboxProps> {
  render() {
    return <Block label={this.props.label}>
      <InputCheckbox {...this.props} />
    </Block>
  }
}

