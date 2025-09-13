import React from "react";

import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import Block from "./Block";
import InputNumber from "./InputNumber";
import { WithTranslation, withTranslation } from "react-i18next";

type FieldMaxZoomInternalProps = {
  value?: number
  onChange(value: number | undefined): unknown
  error?: {message: string}
} & WithTranslation;

const FieldMaxZoomInternal: React.FC<FieldMaxZoomInternalProps> = (props) => {
  const t = props.t;
  return (
    <Block label={t("Max Zoom")} fieldSpec={latest.layer.maxzoom}
      error={props.error}
      data-wd-key="max-zoom"
    >
      <InputNumber
        allowRange={true}
        value={props.value}
        onChange={props.onChange}
        min={latest.layer.maxzoom.minimum}
        max={latest.layer.maxzoom.maximum}
        default={latest.layer.maxzoom.maximum}
        data-wd-key="max-zoom.input"
      />
    </Block>
  );
};

const FieldMaxZoom = withTranslation()(FieldMaxZoomInternal);
export default FieldMaxZoom;
