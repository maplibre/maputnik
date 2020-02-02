import React from 'react'
import PropTypes from 'prop-types'

import SpecField from './SpecField'
import FunctionButtons from './_FunctionButtons'
import InputBlock from '../inputs/InputBlock'

import labelFromFieldName from './_labelFromFieldName'


export default class SpecProperty extends React.Component {
  static propTypes = {
    onZoomClick: PropTypes.func.isRequired,
    onDataClick: PropTypes.func.isRequired,
    fieldName: PropTypes.string,
    fieldSpec: PropTypes.object,
    value: PropTypes.any,
    error: PropTypes.object,
    onExpressionClick: PropTypes.func,
  }

  render() {
    const functionBtn = <FunctionButtons
      fieldSpec={this.props.fieldSpec}
      onZoomClick={this.props.onZoomClick}
      onDataClick={this.props.onDataClick} 
      value={this.props.value}
      onExpressionClick={this.props.onExpressionClick} 
    />

    return <InputBlock
      error={this.props.error}
      fieldSpec={this.props.fieldSpec}
      label={labelFromFieldName(this.props.fieldName)}
      action={functionBtn}
    >
      <SpecField {...this.props} />
    </InputBlock>
  }
}
