import React from 'react'
import PropTypes from 'prop-types'

import InputBlock from '../inputs/InputBlock'
import Button from '../Button'
import {MdDelete} from 'react-icons/md'
import StringInput from '../inputs/StringInput'

import labelFromFieldName from './_labelFromFieldName'
import stringifyPretty from 'json-stringify-pretty-compact'


function isLiteralExpression (value) {
  return (Array.isArray(value) && value.length === 2 && value[0] === "literal");
}

export default class ExpressionProperty extends React.Component {
  static propTypes = {
    onDeleteStop: PropTypes.func,
    fieldName: PropTypes.string,
    fieldSpec: PropTypes.object
  }

  constructor (props) {
    super();
    this.state = {
      lastValue: props.value,
    };
  }

  onChange = (value) => {
    try {
      const jsonVal = JSON.parse(value);

      if (isLiteralExpression(jsonVal)) {
        this.setState({
          lastValue: jsonVal
        });
      }

      this.props.onChange(jsonVal);
    }
    catch (err) {
      // TODO: Handle JSON parse error
    }
  }

  onDelete = () => {
    const {lastValue} = this.state;
    const {value, fieldName, fieldSpec} = this.props;

    if (isLiteralExpression(value)) {
     this.props.onChange(value[1]);
    }
    else if (isLiteralExpression(lastValue)) {
     this.props.onChange(lastValue[1]);
    }
    else {
      this.props.onChange(fieldSpec.default);
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
    >
      <StringInput
        multi={true}
        value={stringifyPretty(this.props.value, {indent: 2})}
        spellCheck={false}
        onInput={this.onChange}
      />
    </InputBlock>
  }
}
