import React from "react";

export type InputSelectProps = {
  value: string
  "data-wd-key"?: string
  options: [string, any][] | string[]
  style?: object
  onChange(value: string | [string, any]): unknown
  title?: string
  "aria-label"?: string
};

export const InputSelect: React.FC<InputSelectProps> = (props) => {
  let options = props.options;
  if(options.length > 0 && !Array.isArray(options[0])) {
    options = options.map((v) => [v, v]) as [string, any][];
  }

  return <select
    className="maputnik-select"
    data-wd-key={props["data-wd-key"]}
    style={props.style}
    title={props.title}
    value={props.value}
    onChange={e => props.onChange(e.target.value)}
    aria-label={props["aria-label"]}
  >
    { options.map(([val, label]) => <option key={val} value={val}>{label}</option>) }
  </select>;
};
