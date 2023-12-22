import React from 'react'
import {formatLayerId} from '../util/format';
import { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';

type AppMessagePanelProps = {
  errors?: unknown[]
  infos?: unknown[]
  mapStyle?: StyleSpecification
  onLayerSelect?(...args: unknown[]): unknown
  currentLayer?: object
  selectedLayerIndex?: number
};

export default class AppMessagePanel extends React.Component<AppMessagePanelProps> {
  static defaultProps = {
    onLayerSelect: () => {},
  }

  render() {
    const {selectedLayerIndex} = this.props;
    const errors = this.props.errors?.map((error: any, idx) => {
      let content;
      if (error.parsed && error.parsed.type === "layer") {
        const {parsed} = error;
        const layerId = this.props.mapStyle?.layers[parsed.data.index].id;
        content = (
          <>
            Layer <span>{formatLayerId(layerId)}</span>: {parsed.data.message}
            {selectedLayerIndex !== parsed.data.index &&
              <>
                &nbsp;&mdash;&nbsp;
                <button
                  className="maputnik-message-panel__switch-button"
                  onClick={() => this.props.onLayerSelect!(parsed.data.index)}
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

    const infos = this.props.infos?.map((m, i) => {
      return <p key={"info-"+i}>{m}</p>
    })

    return <div className="maputnik-message-panel">
      {errors}
      {infos}
    </div>
  }
}

