import React from "react";
import {MdDelete, MdUndo} from "react-icons/md";
import { type WithTranslation, withTranslation } from "react-i18next";

import { Block } from "./Block";
import { InputButton } from "./InputButton";
import { labelFromFieldName } from "../libs/label-from-field-name";
import { FieldJson } from "./FieldJson";
import type { StylePropertySpecification } from "maplibre-gl";
import { type MappedLayerErrors } from "../libs/definitions";


type ExpressionPropertyInternalProps = {
  fieldName: string
  fieldType?: string
  fieldSpec?: StylePropertySpecification
  value?: any
  errors?: MappedLayerErrors
  onDelete?(...args: unknown[]): unknown
  onChange(value: object): void
  onUndo?(...args: unknown[]): unknown
  canUndo?(...args: unknown[]): unknown
  onFocus?(...args: unknown[]): unknown
  onBlur?(...args: unknown[]): unknown
} & WithTranslation;

const ExpressionPropertyInternal: React.FC<ExpressionPropertyInternalProps> = ({
  errors = {},
  onFocus = () => {},
  onBlur = () => {},
  ...props
}) => {
  const {t, value, canUndo} = props;
  const undoDisabled = canUndo ? !canUndo() : true;

  const deleteStopBtn = (
    <>
      {props.onUndo &&
        <InputButton
          key="undo_action"
          onClick={props.onUndo}
          disabled={undoDisabled}
          className="maputnik-delete-stop"
          data-wd-key="undo-expression"
          title={t("Revert from expression")}
        >
          <MdUndo />
        </InputButton>
      }
      <InputButton
        key="delete_action"
        onClick={props.onDelete}
        className="maputnik-delete-stop"
        data-wd-key="delete-expression"
        title={t("Delete expression")}
      >
        <MdDelete />
      </InputButton>
    </>
  );
  let error = undefined;
  if (errors) {
    const fieldKey = props.fieldType ? props.fieldType + "." + props.fieldName : props.fieldName;
    error = errors[fieldKey];
  }
  return <Block
    fieldSpec={props.fieldSpec}
    label={t(labelFromFieldName(props.fieldName))}
    action={deleteStopBtn}
    wideMode={true}
    error={error}
  >
    <FieldJson
      lintType="expression"
      spec={props.fieldSpec}
      className="maputnik-expression-editor"
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      onChange={props.onChange}
    />
  </Block>;
};

export const ExpressionProperty = withTranslation()(ExpressionPropertyInternal);
