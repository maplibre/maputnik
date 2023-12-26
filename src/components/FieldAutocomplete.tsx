import React from 'react'
import Block from './Block'
import InputAutocomplete, { InputAutocompleteProps } from './InputAutocomplete'


type FieldAutocompleteProps = InputAutocompleteProps & {
  label?: string;
};


export default class FieldAutocomplete extends React.Component<FieldAutocompleteProps> {
  render() {
    return <Block label={this.props.label}>
      <InputAutocomplete {...this.props} />
    </Block>
  }
}

