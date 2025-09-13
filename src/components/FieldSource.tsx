import React from "react";

import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import Block from "./Block";
import InputAutocomplete from "./InputAutocomplete";
import { type WithTranslation, withTranslation } from "react-i18next";

type FieldSourceInternalProps = {
  value?: string
  wdKey?: string
  onChange?(value: string| undefined): unknown
  sourceIds?: unknown[]
  error?: {message: string}
} & WithTranslation;

const FieldSourceInternal: React.FC<FieldSourceInternalProps> = ({
  onChange = () => {},
  sourceIds = [],
  wdKey,
  value,
  error,
  t
}) => {
  return (
    <Block
      label={t("Source")}
      fieldSpec={latest.layer.source}
      error={error}
      data-wd-key={wdKey}
    >
      <InputAutocomplete
        value={value}
        onChange={onChange}
        options={sourceIds?.map((src) => [src, src])}
      />
    </Block>
  );
};


const FieldSource = withTranslation()(FieldSourceInternal);
export default FieldSource;
