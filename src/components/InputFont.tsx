import React from "react";
import { InputAutocomplete } from "./InputAutocomplete";

export type InputFontProps = {
  name: string
  value?: string[]
  default?: string[]
  fonts?: unknown[]
  style?: object
  onChange(...args: unknown[]): unknown
  "aria-label"?: string
};

export const InputFont: React.FC<InputFontProps> = ({fonts = [], ...props}) => {
  const getValues = () => {
    const out = props.value || props.default || [];

    // Always put a "" in the last field to you can keep adding entries
    if (out[out.length-1] !== ""){
      return out.concat("");
    }
    else {
      return out;
    }
  };

  const values = getValues();

  const changeFont = (idx: number, newValue: string) => {
    const changedValues = values.slice(0);
    changedValues[idx] = newValue;
    const filteredValues = changedValues
      .filter(v => v !== undefined)
      .filter(v => v !== "");

    props.onChange(filteredValues);
  };

  const inputs = values.map((value, i) => {
    return <li
      key={i}
    >
      <InputAutocomplete
        aria-label={props["aria-label"] || props.name}
        value={value}
        options={fonts.map(f => [f, f])}
        onChange={changeFont.bind(null, i)}
      />
    </li>;
  });

  return (
    <ul className="maputnik-font">
      {inputs}
    </ul>
  );
};
