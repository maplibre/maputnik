import React from "react";
import labelFromFieldName from "../libs/label-from-field-name";
import FunctionButtons from "./_FunctionButtons";
import FieldSpec, { type FieldSpecProps } from "./FieldSpec";

type SpecPropertyProps = FieldSpecProps & {
  fieldName?: string;
  fieldType?: string;
  fieldSpec?: any;
  value?: any;
  errors?: { [key: string]: { message: string } };
  onZoomClick(): void;
  onDataClick(): void;
  onExpressionClick?(): void;
  onElevationClick?(): void;
};

export default class SpecProperty extends React.Component<SpecPropertyProps> {
  static defaultProps = {
    errors: {},
  };

  render() {
    const { errors, fieldName, fieldType } = this.props;

    const functionBtn = (
      <FunctionButtons
        fieldSpec={this.props.fieldSpec}
        onZoomClick={this.props.onZoomClick}
        onDataClick={this.props.onDataClick}
        onExpressionClick={this.props.onExpressionClick}
        onElevationClick={this.props.onElevationClick}
      />
    );

    const error = errors![(fieldType + "." + fieldName) as any] as any;

    return (
      <FieldSpec
        {...this.props}
        error={error}
        fieldSpec={this.props.fieldSpec}
        label={labelFromFieldName(this.props.fieldName || "")}
        action={functionBtn}
      />
    );
  }
}
