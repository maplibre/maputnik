import InputJson from "./InputJson";
import React from "react";
import { withTranslation, type WithTranslation } from "react-i18next";
import { type StyleSpecification } from "maplibre-gl";
import { type StyleSpecificationWithId } from "../libs/definitions";

export type CodeEditorProps = {
  value: StyleSpecification;
  onChange: (value: StyleSpecificationWithId) => void;
  onClose: () => void;
} & WithTranslation;

const CodeEditorInternal: React.FC<CodeEditorProps> = (props) => {

  return <>
    <button className="maputnik-button" onClick={props.onClose} aria-label={props.t("Close")} style={{ position: "sticky", top: "0", zIndex: 1 }}>{props.t("Click to close the editor")}</button>
    <InputJson
        lintType="style"
        value={props.value}
        onChange={props.onChange}
        className={"maputnik-code-editor"}
    />;
  </>
};

const CodeEditor = withTranslation()(CodeEditorInternal);

export default CodeEditor;
