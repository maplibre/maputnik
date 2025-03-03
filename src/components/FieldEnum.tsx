import React from 'react'
import InputEnum, {InputEnumProps} from './InputEnum'
import Fieldset from './Fieldset';


type FieldEnumProps = InputEnumProps & {
  label?: string;
  fieldSpec?: {
    doc: string
  }
};


export default class FieldEnum extends React.Component<FieldEnumProps> {
  render() {
    return <Fieldset label={this.props.label} fieldSpec={this.props.fieldSpec}>
      <InputEnum {...this.props} />
    </Fieldset>
  }
}
