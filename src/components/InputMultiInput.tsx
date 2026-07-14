import React from "react";
import classnames from "classnames";

export type InputMultiInputProps = {
  name?: string
  value: string
  options: any[]
  onChange(...args: unknown[]): unknown
  "aria-label"?: string
};

export const InputMultiInput: React.FC<InputMultiInputProps> = (props) => {
  let options = props.options;
  if(options.length > 0 && !Array.isArray(options[0])) {
    options = options.map(v => [v, v]);
  }

  const selectedValue = props.value || options[0][0];
  const radios = options.map(([val, label])=> {
    return <label
      key={val}
      className={classnames("maputnik-button", "maputnik-radio-as-button", {"maputnik-button-selected": val === selectedValue})}
    >
      <input type="radio"
        name={props.name}
        onChange={_e => props.onChange(val)}
        value={val}
        checked={val === selectedValue}
      />
      {label}
    </label>;
  });

  return <fieldset className="maputnik-multibutton" aria-label={props["aria-label"]}>
    {radios}
  </fieldset>;
};
