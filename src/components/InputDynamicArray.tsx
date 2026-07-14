import React from "react";
import capitalize from "lodash.capitalize";
import {MdDelete} from "react-icons/md";
import { type WithTranslation, withTranslation } from "react-i18next";

import { InputString } from "./InputString";
import { InputNumber } from "./InputNumber";
import { InputButton } from "./InputButton";
import { FieldDocLabel } from "./FieldDocLabel";
import { InputEnum } from "./InputEnum";
import { InputUrl } from "./InputUrl";
import { InputColor } from "./InputColor";


export type InputDynamicArrayProps = {
  value?: (string | number | undefined)[]
  type?: "url" | "number" | "enum" | "string" | "color"
  default?: (string | number | undefined)[]
  onChange?(values: (string | number | undefined)[] | undefined): unknown
  style?: object
  fieldSpec?: {
    values?: any
  }
  "aria-label"?: string
  label: string
};

type InputDynamicArrayInternalProps = InputDynamicArrayProps & WithTranslation;

const InputDynamicArrayInternal: React.FC<InputDynamicArrayInternalProps> = (props) => {
  const values = props.value || props.default || [];

  const changeValue = (idx: number, newValue: string | number | undefined) => {
    const newValues = values.slice(0);
    newValues[idx] = newValue;
    if (props.onChange) props.onChange(newValues);
  };

  const addValue = () => {
    const newValues = values.slice(0);
    if (props.type === "number") {
      newValues.push(0);
    }
    else if (props.type === "url") {
      newValues.push("");
    }
    else if (props.type === "enum") {
      const {fieldSpec} = props;
      const defaultValue = Object.keys(fieldSpec!.values)[0];
      newValues.push(defaultValue);
    } else if (props.type === "color") {
      newValues.push("#000000");
    } else {
      newValues.push("");
    }

    if (props.onChange) props.onChange(newValues);
  };

  const deleteValue = (valueIdx: number) => {
    const newValues = values.slice(0);
    newValues.splice(valueIdx, 1);

    if (props.onChange) props.onChange(newValues.length > 0 ? newValues : undefined);
  };

  const t = props.t;
  const i18nProps = { t, i18n: props.i18n, tReady: props.tReady };
  const inputs = values.map((v, i) => {
    const deleteValueBtn= <DeleteValueInputButton
      onClick={deleteValue.bind(null, i)}
      {...i18nProps}
    />;
    let input;
    if(props.type === "url") {
      input = <InputUrl
        value={v as string}
        onChange={changeValue.bind(null, i)}
        aria-label={props["aria-label"] || props.label}
      />;
    }
    else if (props.type === "number") {
      input = <InputNumber
        value={v as number}
        onChange={changeValue.bind(null, i)}
        aria-label={props["aria-label"] || props.label}
      />;
    }
    else if (props.type === "enum") {
      const options = Object.keys(props.fieldSpec?.values).map(v => [v, capitalize(v)]);
      input = <InputEnum
        options={options}
        value={v as string}
        onChange={changeValue.bind(null, i)}
        aria-label={props["aria-label"] || props.label}
      />;
    }
    else if (props.type === "color") {
      input = <InputColor
        value={v as string}
        onChange={changeValue.bind(null, i)}
        aria-label={props["aria-label"] || props.label}
      />;
    }
    else {
      input = <InputString
        value={v as string}
        onChange={changeValue.bind(null, i)}
        aria-label={props["aria-label"] || props.label}
      />;
    }

    return <div
      style={props.style}
      key={i}
      className="maputnik-array-block"
    >
      <div className="maputnik-array-block-action">
        {deleteValueBtn}
      </div>
      <div className="maputnik-array-block-content">
        {input}
      </div>
    </div>;
  });

  return (
    <div className="maputnik-array">
      {inputs}
      <InputButton
        className="maputnik-array-add-value"
        onClick={addValue}
      >
        {t("Add value")}
      </InputButton>
    </div>
  );
};

export const InputDynamicArray = withTranslation()(InputDynamicArrayInternal);
type DeleteValueInputButtonProps = {
  onClick?(...args: unknown[]): unknown
} & WithTranslation;

const DeleteValueInputButton: React.FC<DeleteValueInputButtonProps> = (props) => {
  const t = props.t;
  return <InputButton
    className="maputnik-delete-stop"
    onClick={props.onClick}
    title={t("Remove array item")}
  >
    <FieldDocLabel
      label={<MdDelete />}
    />
  </InputButton>;
};
