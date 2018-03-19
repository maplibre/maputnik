import React from 'react'
import PropTypes from 'prop-types'

class MessagePanel extends React.Component {
  static propTypes = {
    errors: PropTypes.array,
    infos: PropTypes.array,
  }

  render() {
    const errors = this.props.errors.map((m, i) => {
      return <p key={"error-"+i} className="maputnik-message-panel-error">{m}</p>
    })

    const infos = this.props.infos.map((m, i) => {
      return <p key={"info-"+i}>{m}</p>
    })

    return <div className="maputnik-message-panel">
      {errors}
      {infos}
    </div>
  }
}


export default MessagePanel
