import React from 'react'
import InputMultiInput, {InputMultiInputProps} from './InputMultiInput'
import Fieldset from './Fieldset'


type FieldMultiInputProps = InputMultiInputProps & {
  label?: string
};


export default class FieldMultiInput extends React.Component<FieldMultiInputProps> {
  render() {
    return <Fieldset label={this.props.label}>
      <InputMultiInput {...this.props} />
    </Fieldset>
  }
}

