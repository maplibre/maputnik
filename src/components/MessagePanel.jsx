import React from 'react'
import PropTypes from 'prop-types'

class MessagePanel extends React.Component {
  static propTypes = {
    errors: PropTypes.array,
    infos: PropTypes.array,
    mapStyle: PropTypes.object,
    onLayerSelect: PropTypes.func,
    currentLayer: PropTypes.object,
  }

  static defaultProps = {
    onLayerSelect: () => {},
  }

  render() {
    const errors = this.props.errors.map((error, idx) => {
      let content;
      if (error.parsed && error.parsed.type === "layer") {
        const {parsed} = error;
        const {mapStyle, currentLayer} = this.props;
        const layerId = mapStyle.layers[parsed.data.index].id;
        content = (
          <>
            Layer <span>&apos;{layerId}&apos;</span>: {parsed.data.message}
            {currentLayer.id !== layerId &&
              <>
                &nbsp;&mdash;&nbsp;
                <button
                  className="maputnik-message-panel__switch-button"
                  onClick={() => this.props.onLayerSelect(layerId)}
                >
                  switch to layer
                </button>
              </>
            }
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
