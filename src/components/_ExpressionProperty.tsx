import React from 'react'
import {MdDelete, MdUndo} from 'react-icons/md'
import stringifyPretty from 'json-stringify-pretty-compact'

import Block from './Block'
import InputButton from './InputButton'
import labelFromFieldName from './_labelFromFieldName'
import FieldJson from './FieldJson'


type ExpressionPropertyProps = {
  onDelete?(...args: unknown[]): unknown
  fieldName: string
  fieldType?: string
  fieldSpec?: object
  value?: any
  errors?: {[key: string]: any}
  onChange?(...args: unknown[]): unknown
  onUndo?(...args: unknown[]): unknown
  canUndo?(...args: unknown[]): unknown
  onFocus?(...args: unknown[]): unknown
  onBlur?(...args: unknown[]): unknown
};

type ExpressionPropertyState = {
  jsonError: boolean
};

export default class ExpressionProperty extends React.Component<ExpressionPropertyProps, ExpressionPropertyState> {
  static defaultProps = {
    errors: {},
    onFocus: () => {},
    onBlur: () => {},
  }

  constructor (props:ExpressionPropertyProps) {
    super(props);
    this.state = {
      jsonError: false,
    };
  }

  onJSONInvalid = (_err: Error) => {
    this.setState({
      jsonError: true,
    })
  }

  onJSONValid = () => {
    this.setState({
      jsonError: false,
    })
  }

  render() {
    const {errors, fieldName, fieldType, value, canUndo} = this.props;
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
            title="Revert from expression"
          >
            <MdUndo />
          </InputButton>
        }
        <InputButton
          key="delete_action"
          onClick={this.props.onDelete}
          className="maputnik-delete-stop"
          title="Delete expression"
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
      return stringifyPretty(data, {indent: 2, maxLength: 38})
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
      })

      if (fieldError) {
        foundErrors.push(fieldError);
      }
    }

    return <Block
      error={foundErrors}
      fieldSpec={this.props.fieldSpec}
      label={labelFromFieldName(this.props.fieldName)}
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
    </Block>
  }
}
