import React from 'react'
import InputDynamicArray, {FieldDynamicArrayProps as InputDynamicArrayProps} from './InputDynamicArray'
import Fieldset from './Fieldset'

type FieldDynamicArrayProps = InputDynamicArrayProps & {
  name?: string
};

export default class FieldDynamicArray extends React.Component<FieldDynamicArrayProps> {
  render() {
    return <Fieldset label={this.props.label}>
      <InputDynamicArray {...this.props} />
    </Fieldset>
  }
}
