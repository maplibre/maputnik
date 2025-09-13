import type { LayerSpecification, StyleSpecification } from "maplibre-gl";
import React from "react";
import { Trans, type WithTranslation, withTranslation } from "react-i18next";
import { formatLayerId } from "../libs/format";

type AppMessagePanelInternalProps = {
  errors?: unknown[];
  infos?: string[];
  mapStyle?: StyleSpecification;
  onLayerSelect?(index: number): void;
  currentLayer?: LayerSpecification;
  selectedLayerIndex?: number;
} & WithTranslation;

class AppMessagePanelInternal extends React.Component<AppMessagePanelInternalProps> {
  static defaultProps = {
    onLayerSelect: () => {},
  };

  render() {
    const { t, selectedLayerIndex } = this.props;
    // biome-ignore lint/suspicious/noArrayIndexKey: Error list order is informational and not stable; acceptable to use index
    const errors = this.props.errors?.map((error: any, idx) => {
      let content: React.ReactNode;
      if (error.parsed && error.parsed.type === "layer") {
        const { parsed } = error;
        const layerId = this.props.mapStyle?.layers[parsed.data.index].id;
        content = (
          <>
            <Trans t={t}>
              Layer <span>{formatLayerId(layerId)}</span>: {parsed.data.message}
            </Trans>
            {selectedLayerIndex !== parsed.data.index && (
              <>
                &nbsp;&mdash;&nbsp;
                <button
                  type="button"
                  className="maputnik-message-panel__switch-button"
                  onClick={() => this.props.onLayerSelect?.(parsed.data.index)}
                >
                  {t("switch to layer")}
                </button>
              </>
            )}
          </>
        );
      } else {
        content = error.message;
      }
      const errKey = (
        error?.parsed?.data?.index ??
        error?.message ??
        idx
      ).toString();
      return (
        <p key={`error-${errKey}`} className="maputnik-message-panel-error">
          {content}
        </p>
      );
    });

    const infos = this.props.infos?.map((m) => {
      return <p key={`info-${m}`}>{m}</p>;
    });

    return (
      <div className="maputnik-message-panel">
        {errors}
        {infos}
      </div>
    );
  }
}

const AppMessagePanel = withTranslation()(AppMessagePanelInternal);
export default AppMessagePanel;
