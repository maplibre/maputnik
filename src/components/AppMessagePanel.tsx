import React from "react";
import { formatLayerId } from "../libs/format";
import { type LayerSpecification, type StyleSpecification } from "maplibre-gl";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type MappedError } from "../libs/definitions";

type AppMessagePanelInternalProps = {
  errors?: MappedError[]
  infos?: string[]
  mapStyle?: StyleSpecification
  onLayerSelect?(index: number): void;
  currentLayer?: LayerSpecification
  selectedLayerIndex?: number
} & WithTranslation;

const AppMessagePanelInternal: React.FC<AppMessagePanelInternalProps> = ({
  onLayerSelect = () => { },
  ...props
}) => {
  const { t, selectedLayerIndex } = props;
  const errors = props.errors?.map((error, idx) => {
    let content;
    if (error.parsed && error.parsed.type === "layer") {
      const { parsed } = error;
      const layerId = props.mapStyle?.layers[parsed.data.index].id;
      content = (
        <>
          {t("Layer")} <span>{formatLayerId(layerId)}</span>: {parsed.data.message}
          {selectedLayerIndex !== parsed.data.index &&
            <>
              &nbsp;&mdash;&nbsp;
              <button
                className="maputnik-message-panel__switch-button"
                onClick={() => onLayerSelect!(parsed.data.index)}
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
    return <p key={"error-" + idx} className="maputnik-message-panel-error">
      {content}
    </p>;
  });

  const infos = props.infos?.map((m, i) => {
    return <p key={"info-" + i}>{m}</p>;
  });

  return <div className="maputnik-message-panel">
    {errors}
    {infos}
  </div>;
};

export const AppMessagePanel = withTranslation()(AppMessagePanelInternal);
