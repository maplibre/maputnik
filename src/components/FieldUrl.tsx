import React from 'react'
import InputUrl, {FieldUrlProps as InputUrlProps} from './InputUrl'
import Block from './Block'


type FieldUrlProps = InputUrlProps & {
  label: string;
  fieldSpec?: {
    doc: string
  }
};


export default class FieldUrl extends React.Component<FieldUrlProps> {
  render () {
    return (
      <Block label={this.props.label} fieldSpec={this.props.fieldSpec}>
        <InputUrl {...this.props} />
      </Block>
    );
  }
}
