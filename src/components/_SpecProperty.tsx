import React from 'react'

import SpecField, {SpecFieldProps} from './SpecField'
import FunctionButtons from './_FunctionButtons'

import labelFromFieldName from '../libs/label-from-field-name'


type SpecPropertyProps = SpecFieldProps & {
  onZoomClick(...args: unknown[]): unknown
  onDataClick(...args: unknown[]): unknown
  fieldName?: string
  fieldType?: string
  fieldSpec?: any
  value?: any
  errors?: {[key: string]: {message: string}}
  onExpressionClick?(...args: unknown[]): unknown
};


export default class SpecProperty extends React.Component<SpecPropertyProps> {
  static defaultProps = {
    errors: {},
  }

  render() {
    const {errors, fieldName, fieldType} = this.props;

    const functionBtn = <FunctionButtons
      fieldSpec={this.props.fieldSpec}
      onZoomClick={this.props.onZoomClick}
      onDataClick={this.props.onDataClick}
      onExpressionClick={this.props.onExpressionClick}
    />

    const error = errors![fieldType+"."+fieldName as any] as any;

    return <SpecField
      {...this.props}
      error={error}
      fieldSpec={this.props.fieldSpec}
      label={labelFromFieldName(this.props.fieldName || '')}
      action={functionBtn}
    />
  }
}
