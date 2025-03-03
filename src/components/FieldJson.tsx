import React from 'react'
import InputJson, {InputJsonProps} from './InputJson'


type FieldJsonProps = InputJsonProps & {};


export default class FieldJson extends React.Component<FieldJsonProps> {
  render() {
    return <InputJson {...this.props} />
  }
}
