import React from 'react'

class MessagePanel extends React.Component {
  static propTypes = {
    errors: React.PropTypes.array,
    infos: React.PropTypes.array,
  }

  render() {
    const errors = this.props.errors.map((m, i) => {
      return <p className="maputnik-message-panel-error">{m}</p>
    })

    const infos = this.props.infos.map((m, i) => {
      return <p key={i}>{m}</p>
    })

    return <div className="maputnik-message-panel">
      {errors}
      {infos}
    </div>
  }
}


export default MessagePanel
