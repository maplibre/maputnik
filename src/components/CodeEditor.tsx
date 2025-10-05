import InputJson from "./InputJson";
import React from "react";
import { withTranslation, type WithTranslation } from "react-i18next";
import { type StyleSpecification } from "maplibre-gl";
import { type StyleSpecificationWithId } from "../libs/definitions";

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

const CodeEditor = withTranslation()(CodeEditorInternal);

export default CodeEditor;
