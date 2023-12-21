import React from 'react'
import InputEnum, {InputEnumProps} from './InputEnum'
import Fieldset from './Fieldset';


type FieldEnumProps = InputEnumProps & { label : string };


export default class FieldEnum extends React.Component<FieldEnumProps> {
  render() {
    const {props} = this;

    return <Fieldset label={props.label}>
      <InputEnum {...props} />
    </Fieldset>
  }
}