import InputJson from "./InputJson";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { StyleSpecification } from "maplibre-gl";
import { StyleSpecificationWithId } from "../libs/definitions";

export type CodeEditorProps = {
  value: StyleSpecification;
  onChange: (value: StyleSpecificationWithId) => void;
} & WithTranslation;

const CodeEditorInternal: React.FC<CodeEditorProps> = (props) => {
  return <InputJson
    lintType="style"
    value={props.value}
    onChange={props.onChange}
    className={"maputnik-code-editor"}
  />;
};

export default withTranslation()(CodeEditorInternal);
