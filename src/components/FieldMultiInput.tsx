import React from 'react'
import InputMultiInput, {InputMultiInputProps} from './InputMultiInput'
import Fieldset from './Fieldset'


type FieldMultiInputProps = InputMultiInputProps & {
  label?: string
};


export default class FieldMultiInput extends React.Component<FieldMultiInputProps> {
  render() {
    const {props} = this;

    return <Fieldset label={props.label}>
      <InputMultiInput {...props} />
    </Fieldset>
  }
}

