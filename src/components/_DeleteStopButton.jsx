import React from 'react'
import PropTypes from 'prop-types'

import Button from './Button'
import {MdDelete} from 'react-icons/md'


export default class DeleteStopButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
  }

  render() {
    return <Button
      className="maputnik-delete-stop"
      onClick={this.props.onClick}
      title={"Remove zoom level from stop"}
    >
      <MdDelete />
    </Button>
  }
}
