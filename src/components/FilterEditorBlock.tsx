import React, { type PropsWithChildren } from "react";
import { InputButton } from "./InputButton";
import {MdDelete} from "react-icons/md";
import { type WithTranslation, withTranslation } from "react-i18next";

type FilterEditorBlockInternalProps = PropsWithChildren & {
  onDelete(...args: unknown[]): unknown
} & WithTranslation;

const FilterEditorBlockInternal: React.FC<FilterEditorBlockInternalProps> = (props) => {
  const t = props.t;
  return <div className="maputnik-filter-editor-block">
    <div className="maputnik-filter-editor-block-content">
      {props.children}
    </div>
    <div className="maputnik-filter-editor-block-action">
      <InputButton
        className="maputnik-icon-button"
        onClick={props.onDelete}
        title={t("Delete filter block")}
      >
        <MdDelete />
      </InputButton>
    </div>
  </div>;
};

export const FilterEditorBlock = withTranslation()(FilterEditorBlockInternal);
