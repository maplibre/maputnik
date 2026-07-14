import React, { type ReactElement } from "react";

import { InputColor, type InputColorProps } from "./InputColor";
import { InputNumber, type InputNumberProps } from "./InputNumber";
import { InputCheckbox, type InputCheckboxProps } from "./InputCheckbox";
import { InputString, type InputStringProps } from "./InputString";
import { InputArray, type InputArrayProps } from "./InputArray";
import { InputDynamicArray, type InputDynamicArrayProps } from "./InputDynamicArray";
import { InputFont, type InputFontProps } from "./InputFont";
import { InputAutocomplete, type InputAutocompleteProps } from "./InputAutocomplete";
import { InputEnum, type InputEnumProps } from "./InputEnum";
import capitalize from "lodash.capitalize";

const iconProperties = ["background-pattern", "fill-pattern", "line-pattern", "fill-extrusion-pattern", "icon-image"];

export type FieldSpecType = "number" | "enum" | "resolvedImage" | "formatted" | "string" | "color" | "boolean" | "array" | "numberArray" | "padding" | "colorArray" | "variableAnchorOffsetCollection";

export type InputSpecProps = {
  onChange?(fieldName: string | undefined, value: number | undefined | (string | number | undefined)[]): unknown
  fieldName?: string
  fieldSpec?: {
    default?: unknown
    type?: FieldSpecType
    minimum?: number
    maximum?: number
    values?: unknown[]
    length?: number
    value?: string
  }
  value?: string | number | unknown[] | boolean
  /** Override the style of the field */
  style?: object
  "aria-label"?: string
  label?: string
  action?: ReactElement
};

/** Display any field from the Maplibre GL style spec and
 * choose the correct field component based on the @{fieldSpec}
 * to display @{value}. */
export const InputSpec: React.FC<InputSpecProps> = (props) => {

  const childNodes = () => {
    const commonProps = {
      fieldSpec: props.fieldSpec,
      label: props.label,
      action: props.action,
      style: props.style,
      value: props.value,
      default: props.fieldSpec?.default,
      name: props.fieldName,
      "data-wd-key": "spec-field-input:" + props.fieldName,
      onChange: (newValue: number | undefined | (string | number | undefined)[]) => props.onChange!(props.fieldName, newValue),
      "aria-label": props["aria-label"],
    };
    switch(props.fieldSpec?.type) {
      case "number": return (
        <InputNumber
          {...commonProps as InputNumberProps}
          min={props.fieldSpec.minimum}
          max={props.fieldSpec.maximum}
        />
      );
      case "enum": {
        const options = Object.keys(props.fieldSpec.values || []).map(v => [v, capitalize(v)]);

        return <InputEnum
          {...commonProps as Omit<InputEnumProps, "options">}
          options={options}
        />;
      }
      case "resolvedImage":
      case "formatted":
      case "string":
        if (iconProperties.indexOf(props.fieldName!) >= 0) {
          const options = props.fieldSpec.values || [];
          return <InputAutocomplete
            {...commonProps as Omit<InputAutocompleteProps, "options">}
            options={options.map(f => [f, f])}
          />;
        } else {
          return <InputString
            {...commonProps as InputStringProps}
          />;
        }
      case "color": return (
        <InputColor
          {...commonProps as InputColorProps}
        />
      );
      case "boolean": return (
        <InputCheckbox
          {...commonProps as InputCheckboxProps}
        />
      );
      case "array":
        if(props.fieldName === "text-font") {
          return <InputFont
            {...commonProps as InputFontProps}
            fonts={props.fieldSpec.values}
          />;
        } else {
          if (props.fieldSpec.length) {
            return <InputArray
              {...commonProps as InputArrayProps}
              type={props.fieldSpec.value}
              length={props.fieldSpec.length}
            />;
          } else {
            return <InputDynamicArray
              {...commonProps as InputDynamicArrayProps}
              fieldSpec={props.fieldSpec}
              type={props.fieldSpec.value as InputDynamicArrayProps["type"]}
            />;
          }
        }
      case "numberArray": return (
        <InputDynamicArray
          {...commonProps as InputDynamicArrayProps}
          fieldSpec={props.fieldSpec}
          type="number"
          value={(Array.isArray(props.value) ? props.value : [props.value]) as (string | number | undefined)[]}
        />
      );
      case "colorArray": return (
        <InputDynamicArray
          {...commonProps as InputDynamicArrayProps}
          fieldSpec={props.fieldSpec}
          type="color"
          value={(Array.isArray(props.value) ? props.value : [props.value]) as (string | number | undefined)[]}
        />
      );
      case "padding": return (
        <InputArray
          {...commonProps as InputArrayProps}
          type="number"
          value={(Array.isArray(props.value) ? props.value : [props.value]) as (string | number | undefined)[]}
          length={4}
        />
      );
      default:
        console.warn(`No proper field input for ${props.fieldName} type: ${props.fieldSpec?.type}`);
        return null;
    }
  };

  return (
    <div data-wd-key={"spec-field:"+props.fieldName}>
      {childNodes()}
    </div>
  );
};
