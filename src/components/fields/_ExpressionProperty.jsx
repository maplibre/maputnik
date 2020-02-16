import React from 'react'
import PropTypes from 'prop-types'

import InputBlock from '../inputs/InputBlock'
import Button from '../Button'
import {MdDelete, MdUndo} from 'react-icons/md'
import StringInput from '../inputs/StringInput'

import labelFromFieldName from './_labelFromFieldName'
import stringifyPretty from 'json-stringify-pretty-compact'
import JSONEditor from '../layers/JSONEditor'


export default class ExpressionProperty extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func,
    fieldName: PropTypes.string,
    fieldSpec: PropTypes.object,
    value: PropTypes.any,
    errors: PropTypes.object,
    onChange: PropTypes.func,
    onUndo: PropTypes.func,
    canUndo: PropTypes.func,
  }

  static defaultProps = {
    errors: {},
  }

  constructor (props) {
    super();
  }

  render() {
    const {errors, fieldName, fieldType, value, canUndo} = this.props;
    const undoDisabled = canUndo ? !canUndo() : true;

    const deleteStopBtn = (
      <>
        {this.props.onUndo &&
          <Button
            key="undo_action"
            onClick={this.props.onUndo}
            disabled={undoDisabled}
            className="maputnik-delete-stop"
          >
            <MdUndo />
          </Button>
        }
        <Button
          key="delete_action"
          onClick={this.props.onDelete}
          className="maputnik-delete-stop"
        >
          <MdDelete />
        </Button>
      </>
    );

    const error = errors[fieldType+"."+fieldName];

    return <InputBlock
      error={error}
      fieldSpec={this.props.fieldSpec}
      label={labelFromFieldName(this.props.fieldName)}
      action={deleteStopBtn}
      wideMode={true}
    >
      <JSONEditor
        className="maputnik-expression-editor"
        layer={value}
        lineNumbers={false}
        maxHeight={200}
        lineWrapping={true}
        getValue={(data) => stringifyPretty(data, {indent: 2, maxLength: 50})}
        onChange={this.props.onChange}
      />
    </InputBlock>
  }
}
