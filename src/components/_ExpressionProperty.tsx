import React from "react";
import {MdDelete, MdUndo} from "react-icons/md";
import { type WithTranslation, withTranslation } from "react-i18next";

import Block from "./Block";
import InputButton from "./InputButton";
import labelFromFieldName from "../libs/label-from-field-name";
import FieldJson from "./FieldJson";
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

class ExpressionPropertyInternal extends React.Component<ExpressionPropertyInternalProps> {
  static defaultProps = {
    errors: {},
    onFocus: () => {},
    onBlur: () => {},
  };

  constructor(props: ExpressionPropertyInternalProps) {
    super(props);
    this.state = {
      jsonError: false,
    };
  }

  render() {
    const {t, value, canUndo} = this.props;
    const undoDisabled = canUndo ? !canUndo() : true;

    const deleteStopBtn = (
      <>
        {this.props.onUndo &&
          <InputButton
            key="undo_action"
            onClick={this.props.onUndo}
            disabled={undoDisabled}
            className="maputnik-delete-stop"
            title={t("Revert from expression")}
          >
            <MdUndo />
          </InputButton>
        }
        <InputButton
          key="delete_action"
          onClick={this.props.onDelete}
          className="maputnik-delete-stop"
          title={t("Delete expression")}
        >
          <MdDelete />
        </InputButton>
      </>
    );
    let error = undefined;
    if (this.props.errors) {
      const fieldKey = this.props.fieldType ? this.props.fieldType + "." + this.props.fieldName : this.props.fieldName;
      error = this.props.errors[fieldKey];
    }
    return <Block
      fieldSpec={this.props.fieldSpec}
      label={t(labelFromFieldName(this.props.fieldName))}
      action={deleteStopBtn}
      wideMode={true}
      error={error}
    >
      <FieldJson
        lintType="expression"
        spec={this.props.fieldSpec}
        className="maputnik-expression-editor"
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        value={value}
        maxHeight={200}
        onChange={this.props.onChange}
      />
    </Block>;
  }
}

const ExpressionProperty = withTranslation()(ExpressionPropertyInternal);
export default ExpressionProperty;
