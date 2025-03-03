import React from 'react'
import InputArray, { FieldArrayProps as InputArrayProps } from './InputArray'
import Fieldset from './Fieldset'

type FieldArrayProps = InputArrayProps & {
  name?: string
  fieldSpec?: {
    doc: string
  }
};

export default class FieldArray extends React.Component<FieldArrayProps> {
  render() {
    return <Fieldset label={this.props.label} fieldSpec={this.props.fieldSpec}>
      <InputArray {...this.props} />
    </Fieldset>
  }
}
