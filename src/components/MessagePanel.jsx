import React from 'react'
import PropTypes from 'prop-types'

class MessagePanel extends React.Component {
  static propTypes = {
    errors: PropTypes.array,
    infos: PropTypes.array,
    mapStyle: PropTypes.object,
  }

  render() {
    const errors = this.props.errors.map((error, idx) => {
      let content;
      if (error.parsed && error.parsed.type === "layer") {
        const {parsed} = error;
        const {mapStyle} = this.props;
        content = (
          <>
            Layer <span>&apos;{mapStyle.layers[parsed.data.index].id}&apos;</span>: {parsed.data.message}
          </>
        );
      }
      else {
        content = error.message;
      }
      return <p key={"error-"+idx} className="maputnik-message-panel-error">
        {content}
      </p>
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
