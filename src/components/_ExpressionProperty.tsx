import React from "react";
import {MdDelete, MdUndo} from "react-icons/md";
import stringifyPretty from "json-stringify-pretty-compact";
import { type WithTranslation, withTranslation } from "react-i18next";

import Block from "./Block";
import InputButton from "./InputButton";
import labelFromFieldName from "../libs/label-from-field-name";
import FieldJson from "./FieldJson";


type ExpressionPropertyInternalProps = {
  onDelete?(...args: unknown[]): unknown
  fieldName: string
  fieldType?: string
  fieldSpec?: object
  value?: any
  errors?: {[key: string]: {message: string}}
  onChange?(...args: unknown[]): unknown
  onUndo?(...args: unknown[]): unknown
  canUndo?(...args: unknown[]): unknown
  onFocus?(...args: unknown[]): unknown
  onBlur?(...args: unknown[]): unknown
} & WithTranslation;

type ExpressionPropertyState = {
  jsonError: boolean
};

class ExpressionPropertyInternal extends React.Component<ExpressionPropertyInternalProps, ExpressionPropertyState> {
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

  onJSONInvalid = (_err: Error) => {
    this.setState({
      jsonError: true,
    });
  };

  onJSONValid = () => {
    this.setState({
      jsonError: false,
    });
  };

  render() {
    const {t, errors, fieldName, fieldType, value, canUndo} = this.props;
    const {jsonError} = this.state;
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

    const fieldKey = fieldType === undefined ? fieldName : `${fieldType}.${fieldName}`;

    const fieldError = errors![fieldKey];
    const errorKeyStart = `${fieldKey}[`;
    const foundErrors = [];

    function getValue(data: any) {
      return stringifyPretty(data, {indent: 2, maxLength: 38});
    }

    if (jsonError) {
      foundErrors.push({message: "Invalid JSON"});
    }
    else {
      Object.entries(errors!)
        .filter(([key, _error]) => {
          return key.startsWith(errorKeyStart);
        })
        .forEach(([_key, error]) => {
          return foundErrors.push(error);
        });

      if (fieldError) {
        foundErrors.push(fieldError);
      }
    }

    return <Block
      // this feels like an incorrect type...? `foundErrors` is an array of objects, not a single object
      error={foundErrors as any}
      fieldSpec={this.props.fieldSpec}
      label={t(labelFromFieldName(this.props.fieldName))}
      action={deleteStopBtn}
      wideMode={true}
    >
      <FieldJson
        mode={{name: "mgl"}}
        lint={{
          context: "expression",
          spec: this.props.fieldSpec,
        }}
        className="maputnik-expression-editor"
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onJSONInvalid={this.onJSONInvalid}
        onJSONValid={this.onJSONValid}
        layer={value}
        lineNumbers={false}
        maxHeight={200}
        lineWrapping={true}
        getValue={getValue}
        onChange={this.props.onChange}
      />
    </Block>;
  }
}

const ExpressionProperty = withTranslation()(ExpressionPropertyInternal);
export default ExpressionProperty;
