import capitalize from "lodash.capitalize";
import React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import FieldDocLabel from "./FieldDocLabel";
import InputButton from "./InputButton";
import InputColor from "./InputColor";
import InputEnum from "./InputEnum";
import InputNumber from "./InputNumber";
import InputString from "./InputString";
import InputUrl from "./InputUrl";

export type InputDynamicArrayProps = {
  value?: (string | number | undefined)[];
  type?: "url" | "number" | "enum" | "string" | "color";
  default?: (string | number | undefined)[];
  onChange?(values: (string | number | undefined)[] | undefined): unknown;
  style?: object;
  fieldSpec?: {
    values?: any;
  };
  "aria-label"?: string;
  label: string;
};

type InputDynamicArrayInternalProps = InputDynamicArrayProps & WithTranslation;

class InputDynamicArrayInternal extends React.Component<InputDynamicArrayInternalProps> {
  changeValue(idx: number, newValue: string | number | undefined) {
    const values = this.values.slice(0);
    values[idx] = newValue;
    if (this.props.onChange) this.props.onChange(values);
  }

  get values() {
    return this.props.value || this.props.default || [];
  }

  addValue = () => {
    const values = this.values.slice(0);
    if (this.props.type === "number") {
      values.push(0);
    } else if (this.props.type === "url") {
      values.push("");
    } else if (this.props.type === "enum") {
      const { fieldSpec } = this.props;
      const defaultValue = Object.keys(fieldSpec?.values)[0];
      values.push(defaultValue);
    } else if (this.props.type === "color") {
      values.push("#000000");
    } else {
      values.push("");
    }

    if (this.props.onChange) this.props.onChange(values);
  };

  deleteValue(valueIdx: number) {
    const values = this.values.slice(0);
    values.splice(valueIdx, 1);

    if (this.props.onChange)
      this.props.onChange(values.length > 0 ? values : undefined);
  }

  render() {
    const t = this.props.t;
    const i18nProps = { t, i18n: this.props.i18n, tReady: this.props.tReady };
    const inputs = this.values.map((v, i) => {
      const deleteValueBtn = (
        <DeleteValueInputButton
          onClick={this.deleteValue.bind(this, i)}
          {...i18nProps}
        />
      );
      let input;
      if (this.props.type === "url") {
        input = (
          <InputUrl
            value={v as string}
            onChange={this.changeValue.bind(this, i)}
            aria-label={this.props["aria-label"] || this.props.label}
          />
        );
      } else if (this.props.type === "number") {
        input = (
          <InputNumber
            value={v as number}
            onChange={this.changeValue.bind(this, i)}
            aria-label={this.props["aria-label"] || this.props.label}
          />
        );
      } else if (this.props.type === "enum") {
        const options = Object.keys(this.props.fieldSpec?.values).map((v) => [
          v,
          capitalize(v),
        ]);
        input = (
          <InputEnum
            options={options}
            value={v as string}
            onChange={this.changeValue.bind(this, i)}
            aria-label={this.props["aria-label"] || this.props.label}
          />
        );
      } else if (this.props.type === "color") {
        input = (
          <InputColor
            value={v as string}
            onChange={this.changeValue.bind(this, i)}
            aria-label={this.props["aria-label"] || this.props.label}
          />
        );
      } else {
        input = (
          <InputString
            value={v as string}
            onChange={this.changeValue.bind(this, i)}
            aria-label={this.props["aria-label"] || this.props.label}
          />
        );
      }

      return (
        <div style={this.props.style} key={i} className="maputnik-array-block">
          <div className="maputnik-array-block-action">{deleteValueBtn}</div>
          <div className="maputnik-array-block-content">{input}</div>
        </div>
      );
    });

    return (
      <div className="maputnik-array">
        {inputs}
        <InputButton
          className="maputnik-array-add-value"
          onClick={this.addValue}
        >
          {t("Add value")}
        </InputButton>
      </div>
    );
  }
}

const InputDynamicArray = withTranslation()(InputDynamicArrayInternal);
export default InputDynamicArray;

type DeleteValueInputButtonProps = {
  onClick?(...args: unknown[]): unknown;
} & WithTranslation;

class DeleteValueInputButton extends React.Component<DeleteValueInputButtonProps> {
  render() {
    const t = this.props.t;
    return (
      <InputButton
        className="maputnik-delete-stop"
        onClick={this.props.onClick}
        title={t("Remove array item")}
      >
        <FieldDocLabel label={<MdDelete />} />
      </InputButton>
    );
  }
}
