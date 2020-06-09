import React from 'react'
import PropTypes from 'prop-types'

import Block from './Block'
import InputButton from './InputButton'
import {MdDelete, MdUndo} from 'react-icons/md'
import FieldString from './FieldString'

import labelFromFieldName from './_labelFromFieldName'
import stringifyPretty from 'json-stringify-pretty-compact'
import FieldJson from './FieldJson'


export default class ExpressionProperty extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func,
    fieldName: PropTypes.string,
    fieldType: PropTypes.string,
    fieldSpec: PropTypes.object,
    value: PropTypes.any,
    errors: PropTypes.object,
    onChange: PropTypes.func,
    onUndo: PropTypes.func,
    canUndo: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  }

  static defaultProps = {
    errors: {},
    onFocus: () => {},
    onBlur: () => {},
  }

  constructor (props) {
    super();
    this.state = {
      jsonError: false,
    };
  }

  onJSONInvalid = (err) => {
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

    const fieldError = errors[fieldKey];
    const errorKeyStart = `${fieldKey}[`;
    const foundErrors = [];

    function getValue (data) {
      return stringifyPretty(data, {indent: 2, maxLength: 38})
    }
    
    if (jsonError) {
      foundErrors.push({message: "Invalid JSON"});
    }
    else {
      Object.entries(errors)
      .filter(([key, error]) => {
        return key.startsWith(errorKeyStart);
      })
      .forEach(([key, error]) => {
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
