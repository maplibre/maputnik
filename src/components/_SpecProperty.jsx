import React from 'react'
import PropTypes from 'prop-types'

import SpecField from './SpecField'
import FunctionButtons from './_FunctionButtons'
import Block from './Block'

import labelFromFieldName from './_labelFromFieldName'


export default class SpecProperty extends React.Component {
  static propTypes = {
    onZoomClick: PropTypes.func.isRequired,
    onDataClick: PropTypes.func.isRequired,
    fieldName: PropTypes.string,
    fieldType: PropTypes.string,
    fieldSpec: PropTypes.object,
    value: PropTypes.any,
    errors: PropTypes.object,
    onExpressionClick: PropTypes.func,
  }

  static defaultProps = {
    errors: {},
  }

  render() {
    const {errors, fieldName, fieldType} = this.props;

    const functionBtn = <FunctionButtons
      fieldSpec={this.props.fieldSpec}
      onZoomClick={this.props.onZoomClick}
      onDataClick={this.props.onDataClick} 
      value={this.props.value}
      onExpressionClick={this.props.onExpressionClick} 
    />

    const error = errors[fieldType+"."+fieldName];

    return <SpecField
      {...this.props}
      error={error}
      fieldSpec={this.props.fieldSpec}
      label={labelFromFieldName(this.props.fieldName)}
      action={functionBtn}
    />
  }
}
