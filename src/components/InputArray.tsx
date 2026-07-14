import React, { useState } from "react";
import { InputString } from "./InputString";
import { InputNumber } from "./InputNumber";

export type InputArrayProps = {
  value: (string | number | undefined)[]
  type?: string
  length?: number
  default?: (string | number | undefined)[]
  onChange?(value: (string | number | undefined)[] | undefined): unknown
  "aria-label"?: string
  label?: string
};

export const InputArray: React.FC<InputArrayProps> = ({
  value: propsValue = [],
  default: propsDefault = [],
  ...rest
}) => {
  const props = { value: propsValue, default: propsDefault, ...rest };

  // The original seeded this from props and then never let props overwrite it
  // again (its getDerivedStateFromProps assigned the existing state back in
  // both branches), so the value is owned by this component after mount.
  const [value, setValue] = useState<(string | number | undefined)[]>(() => propsValue.slice(0));

  function isComplete(val: unknown[]) {
    return Array(props.length).fill(null).every((_, i) => {
      const v = val[i];
      return !(v === undefined || v === "");
    });
  }

  function changeValue(idx: number, newValue: string | number | undefined) {
    const nextValue = value.slice(0);
    nextValue[idx] = newValue;

    setValue(nextValue);

    if (isComplete(nextValue) && props.onChange) {
      props.onChange(nextValue);
    }
    else if (props.onChange) {
      // Unset until complete
      props.onChange(undefined);
    }
  }

  const containsValues = (
    value.length > 0 &&
    !value.every(val => {
      return (val === "" || val === undefined);
    })
  );

  const inputs = Array(props.length).fill(null).map((_, i) => {
    if(props.type === "number") {
      return <InputNumber
        key={i}
        default={containsValues || !props.default ? undefined : props.default[i] as number}
        value={value[i] as number}
        required={containsValues ? true : false}
        onChange={(v) => changeValue(i, v)}
        aria-label={props["aria-label"] || props.label}
      />;
    } else {
      return <InputString
        key={i}
        default={containsValues || !props.default ? undefined : props.default[i] as string}
        value={value[i] as string}
        required={containsValues ? true : false}
        onChange={(v) => changeValue(i, v)}
        aria-label={props["aria-label"] || props.label}
      />;
    }
  });

  return (
    <div className="maputnik-array">
      {inputs}
    </div>
  );
};
