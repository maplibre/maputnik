import React from "react";

import { FieldSpec, type FieldSpecProps } from "./FieldSpec";
import { FunctionInputButtons as FunctionButtons } from "./FunctionButtons";

import { labelFromFieldName } from "../libs/label-from-field-name";


type SpecPropertyProps = FieldSpecProps & {
  fieldName?: string
  fieldType?: string
  fieldSpec?: any
  value?: any
  errors?: {[key: string]: {message: string}}
  onZoomClick(): void
  onDataClick(): void
  onExpressionClick?(): void
  onElevationClick?(): void
};


export const SpecProperty: React.FC<SpecPropertyProps> = (props) => {
  const {errors = {}, fieldName, fieldType} = props;

  const functionBtn = <FunctionButtons
    fieldSpec={props.fieldSpec}
    onZoomClick={props.onZoomClick}
    onDataClick={props.onDataClick}
    onExpressionClick={props.onExpressionClick}
    onElevationClick={props.onElevationClick}
  />;

  const error = errors[fieldType+"."+fieldName as any] as any;

  const propsWithDefaults = {...props, errors};

  return <FieldSpec
    {...propsWithDefaults}
    error={error}
    fieldSpec={props.fieldSpec}
    label={labelFromFieldName(props.fieldName || "")}
    action={functionBtn}
  />;
};
