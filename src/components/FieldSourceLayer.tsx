import React from "react";

import {latest} from "@maplibre/maplibre-gl-style-spec";
import Block from "./Block";
import InputAutocomplete from "./InputAutocomplete";
import { type WithTranslation, withTranslation } from "react-i18next";

type FieldSourceLayerInternalProps = {
  value?: string
  onChange?(...args: unknown[]): unknown
  sourceLayerIds?: unknown[]
  error?: {message: string}
} & WithTranslation;

const FieldSourceLayerInternal: React.FC<FieldSourceLayerInternalProps> = ({
  onChange = () => {},
  sourceLayerIds = [],
  value,
  error,
  t
}) => {
  return (
    <Block
      label={t("Source Layer")}
      fieldSpec={latest.layer["source-layer"]}
      data-wd-key="layer-source-layer"
      error={error}
    >
      <InputAutocomplete
        value={value}
        onChange={onChange}
        options={sourceLayerIds?.map((l) => [l, l])}
      />
    </Block>
  );
};

const FieldSourceLayer = withTranslation()(FieldSourceLayerInternal);
export default FieldSourceLayer;
