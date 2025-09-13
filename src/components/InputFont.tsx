import React from "react";
import InputAutocomplete from "./InputAutocomplete";

export type InputFontProps = {
  name: string;
  value?: string[];
  default?: string[];
  fonts?: unknown[];
  style?: object;
  onChange(...args: unknown[]): unknown;
  "aria-label"?: string;
};

export default class InputFont extends React.Component<InputFontProps> {
  static defaultProps = {
    fonts: [],
  };

  get values() {
    const out = this.props.value || this.props.default || [];

    // Always put a "" in the last field to you can keep adding entries
    if (out[out.length - 1] !== "") {
      return out.concat("");
    } else {
      return out;
    }
  }

  changeFont(idx: number, newValue: string) {
    const changedValues = this.values.slice(0);
    changedValues[idx] = newValue;
    const filteredValues = changedValues
      .filter((v) => v !== undefined)
      .filter((v) => v !== "");

    this.props.onChange(filteredValues);
  }

  render() {
    const inputs = this.values.map((value, i) => {
      return (
        <li key={i}>
          <InputAutocomplete
            aria-label={this.props["aria-label"] || this.props.name}
            value={value}
            options={this.props.fonts?.map((f) => [f, f])}
            onChange={this.changeFont.bind(this, i)}
          />
        </li>
      );
    });

    return <ul className="maputnik-font">{inputs}</ul>;
  }
}
