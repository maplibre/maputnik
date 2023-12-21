import React from 'react'
import Block from './Block'
import InputAutocomplete, { InputAutocompleteProps } from './InputAutocomplete'


type FieldAutocompleteProps = InputAutocompleteProps & {
  label?: string;
};


export default class FieldAutocomplete extends React.Component<FieldAutocompleteProps> {
  render() {
    const {props} = this;

    return <Block label={props.label}>
      <InputAutocomplete {...props} />
    </Block>
  }
}

