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
    fieldSpec: PropTypes.object
  }

  render() {
    const functionBtn = <FunctionButtons
      fieldSpec={this.props.fieldSpec}
      onZoomClick={this.props.onZoomClick}
      onDataClick={this.props.onDataClick} 
    />

    return <InputBlock
      doc={this.props.fieldSpec.doc}
      label={labelFromFieldName(this.props.fieldName)}
      action={functionBtn}
    >
      <SpecField {...this.props} />
    </InputBlock>
  }
}
