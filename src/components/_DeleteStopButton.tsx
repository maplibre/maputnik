import React from 'react'

import InputButton from './InputButton'
import {MdDelete} from 'react-icons/md'


type DeleteStopButtonProps = {
  onClick?(...args: unknown[]): unknown
};


export default class DeleteStopButton extends React.Component<DeleteStopButtonProps> {
  render() {
    return <InputButton
      className="maputnik-delete-stop"
      onClick={this.props.onClick}
      title={"Remove zoom level from stop"}
    >
      <MdDelete />
    </InputButton>
  }
}
