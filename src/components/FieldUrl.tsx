import React from 'react'
import InputUrl, {FieldUrlProps as InputUrlProps} from './InputUrl'
import Block from './Block'


type FieldUrlProps = InputUrlProps & {
  label: string;
};


export default class FieldUrl extends React.Component<FieldUrlProps> {
  render () {
    const {props} = this;

    return (
      <Block label={this.props.label}>
        <InputUrl {...props} />
      </Block>
    );
  }
}

