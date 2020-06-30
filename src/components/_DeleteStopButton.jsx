import React from 'react'
import PropTypes from 'prop-types'

import InputButton from './InputButton'
import {MdDelete} from 'react-icons/md'


export default class DeleteStopButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
  }

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
