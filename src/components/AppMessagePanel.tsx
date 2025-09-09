import React from 'react'
import {formatLayerId} from '../libs/format';
import {LayerSpecification, StyleSpecification} from 'maplibre-gl';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

type AppMessagePanelInternalProps = {
  errors?: unknown[]
  infos?: string[]
  mapStyle?: StyleSpecification
  onLayerSelect?(index: number): void;
  currentLayer?: LayerSpecification
  selectedLayerIndex?: number
} & WithTranslation;

class AppMessagePanelInternal extends React.Component<AppMessagePanelInternalProps> {
  static defaultProps = {
    onLayerSelect: () => {},
  }

  render() {
    const {t, selectedLayerIndex} = this.props;
    const errors = this.props.errors?.map((error: any, idx) => {
      let content;
      if (error.parsed && error.parsed.type === "layer") {
        const {parsed} = error;
        const layerId = this.props.mapStyle?.layers[parsed.data.index].id;
        content = (
          <>
            <Trans t={t}>
              Layer <span>{formatLayerId(layerId)}</span>: {parsed.data.message}
            </Trans>
            {selectedLayerIndex !== parsed.data.index &&
              <>
                &nbsp;&mdash;&nbsp;
                <button
                  className="maputnik-message-panel__switch-button"
                  onClick={() => this.props.onLayerSelect!(parsed.data.index)}
                >
                  {t("switch to layer")}
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

const AppMessagePanel = withTranslation()(AppMessagePanelInternal);
export default AppMessagePanel;
