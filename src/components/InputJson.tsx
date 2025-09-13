import classnames from "classnames";
import CodeMirror, { type ModeSpec } from "codemirror";
import React from "react";
import { Trans, type WithTranslation, withTranslation } from "react-i18next";

import "codemirror/mode/javascript/javascript";
import "codemirror/addon/lint/lint";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint.css";
import stringifyPretty from "json-stringify-pretty-compact";
import "../libs/codemirror-mgl";
import type { LayerSpecification } from "maplibre-gl";

export type InputJsonProps = {
  layer: LayerSpecification;
  maxHeight?: number;
  onChange?(...args: unknown[]): unknown;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  getValue?(data: any): string;
  gutters?: string[];
  className?: string;
  onFocus?(...args: unknown[]): unknown;
  onBlur?(...args: unknown[]): unknown;
  onJSONValid?(...args: unknown[]): unknown;
  onJSONInvalid?(...args: unknown[]): unknown;
  mode?: ModeSpec<any>;
  lint?: boolean | object;
};
type InputJsonInternalProps = InputJsonProps & WithTranslation;

type InputJsonState = {
  isEditing: boolean;
  showMessage: boolean;
  prevValue: string;
};

class InputJsonInternal extends React.Component<
  InputJsonInternalProps,
  InputJsonState
> {
  static defaultProps = {
    lineNumbers: true,
    lineWrapping: false,
    gutters: ["CodeMirror-lint-markers"],
    getValue: (data: any) => {
      return stringifyPretty(data, { indent: 2, maxLength: 40 });
    },
    onFocus: () => {},
    onBlur: () => {},
    onJSONInvalid: () => {},
    onJSONValid: () => {},
  };
  _keyEvent: string;
  _doc: CodeMirror.Editor | undefined;
  _el: HTMLDivElement | null = null;
  _cancelNextChange: boolean = false;

  constructor(props: InputJsonInternalProps) {
    super(props);
    this._keyEvent = "keyboard";
    this.state = {
      isEditing: false,
      showMessage: false,
      prevValue: this.props.getValue?.(this.props.layer) ?? "",
    };
  }

  componentDidMount() {
    this._doc = CodeMirror(this._el!, {
      value: this.props.getValue?.(this.props.layer) ?? "",
      mode: this.props.mode || {
        name: "mgl",
      },
      lineWrapping: this.props.lineWrapping,
      tabSize: 2,
      theme: "maputnik",
      viewportMargin: Infinity,
      lineNumbers: this.props.lineNumbers,
      lint: this.props.lint || {
        context: "layer",
      },
      matchBrackets: true,
      gutters: this.props.gutters,
      scrollbarStyle: "null",
    });

    this._doc.on("change", this.onChange);
    this._doc.on("focus", this.onFocus);
    this._doc.on("blur", this.onBlur);
  }

  onPointerDown = () => {
    this._keyEvent = "pointer";
  };

  onFocus = () => {
    if (this.props.onFocus) this.props.onFocus();
    this.setState({
      isEditing: true,
      showMessage: this._keyEvent === "keyboard",
    });
  };

  onBlur = () => {
    this._keyEvent = "keyboard";
    if (this.props.onBlur) this.props.onBlur();
    this.setState({
      isEditing: false,
      showMessage: false,
    });
  };

  componentWillUnMount() {
    this._doc?.off("change", this.onChange);
    this._doc?.off("focus", this.onFocus);
    this._doc?.off("blur", this.onBlur);
  }

  componentDidUpdate(prevProps: InputJsonProps) {
    if (!this.state.isEditing && prevProps.layer !== this.props.layer) {
      this._cancelNextChange = true;
      this._doc?.setValue(this.props.getValue?.(this.props.layer) ?? "");
    }
  }

  onChange = (_e: unknown) => {
    if (this._cancelNextChange) {
      this._cancelNextChange = false;
      this.setState({
        prevValue: this._doc?.getValue() ?? "",
      });
      return;
    }
    const newCode = this._doc?.getValue() ?? "";

    if (this.state.prevValue !== newCode) {
      let parsedLayer: unknown, err: unknown;
      try {
        parsedLayer = JSON.parse(newCode);
      } catch (_err) {
        err = _err;
        console.warn(_err);
      }

      if (err && this.props.onJSONInvalid) {
        this.props.onJSONInvalid();
      } else {
        if (this.props.onChange) this.props.onChange(parsedLayer);
        if (this.props.onJSONValid) this.props.onJSONValid();
      }
    }

    this.setState({
      prevValue: newCode,
    });
  };

  render() {
    const t = this.props.t;
    const { showMessage } = this.state;
    const style = {} as { maxHeight?: number };
    if (this.props.maxHeight) {
      style.maxHeight = this.props.maxHeight;
    }

    return (
      <div
        className="JSONEditor"
        onPointerDown={this.onPointerDown}
        aria-hidden="true"
      >
        <div
          className={classnames("JSONEditor__message", {
            "JSONEditor__message--on": showMessage,
          })}
        >
          <Trans t={t}>
            Press <kbd>ESC</kbd> to lose focus
          </Trans>
        </div>
        <div
          className={classnames("codemirror-container", this.props.className)}
          ref={(el) => {
            this._el = el;
          }}
          style={style}
        />
      </div>
    );
  }
}

const InputJson = withTranslation()(InputJsonInternal);
export default InputJson;
