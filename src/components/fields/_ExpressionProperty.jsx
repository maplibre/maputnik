import React from 'react'
import PropTypes from 'prop-types'

import InputBlock from '../inputs/InputBlock'
import Button from '../Button'
import {MdDelete} from 'react-icons/md'
import StringInput from '../inputs/StringInput'

import labelFromFieldName from './_labelFromFieldName'
import stringifyPretty from 'json-stringify-pretty-compact'
import JSONEditor from '../layers/JSONEditor'


function isLiteralExpression (value) {
  return (Array.isArray(value) && value.length === 2 && value[0] === "literal");
}

export default class ExpressionProperty extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func,
    fieldName: PropTypes.string,
    fieldSpec: PropTypes.object
  }

  constructor (props) {
    super();
    this.state = {
      lastValue: props.value,
    };
  }

  onChange = (jsonVal) => {
    if (isLiteralExpression(jsonVal)) {
      this.setState({
        lastValue: jsonVal
      });
    }

    this.props.onChange(jsonVal);
  }

  onDelete = () => {
    const {lastValue} = this.state;
    const {value, fieldName, fieldSpec} = this.props;

    if (isLiteralExpression(value)) {
     this.props.onDelete(value[1]);
    }
    else if (isLiteralExpression(lastValue)) {
     this.props.onDelete(lastValue[1]);
    }
    else {
      this.props.onDelete(fieldSpec.default);
    }
  }

  render() {
    const deleteStopBtn = (
      <Button
        onClick={this.onDelete}
        className="maputnik-delete-stop"
      >
        <MdDelete />
      </Button>
    );

    return <InputBlock
      error={this.props.error}
      doc={this.props.fieldSpec.doc}
      label={labelFromFieldName(this.props.fieldName)}
      action={deleteStopBtn}
      wideMode={true}
    >
      <JSONEditor
        className="maputnik-expression-editor"
        layer={this.props.value}
        lineNumbers={false}
        maxHeight={200}
        lineWrapping={true}
        getValue={(data) => stringifyPretty(data, {indent: 2, maxLength: 50})}
        onChange={this.onChange}
      />
    </InputBlock>
  }
}
