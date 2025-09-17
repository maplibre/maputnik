import React from "react";
import classnames from "classnames";
import { type WithTranslation, withTranslation } from "react-i18next";

import { type EditorView } from "@codemirror/view";
import stringifyPretty from "json-stringify-pretty-compact";

import {createEditor} from "../libs/codemirror-editor-factory";
import type { StylePropertySpecification } from "maplibre-gl";

export type InputJsonProps = {
  value: object
  maxHeight?: number
  className?: string
  onChange(object: object): void
  onFocus?(...args: unknown[]): unknown
  onBlur?(...args: unknown[]): unknown
  lintType: "layer" | "style" | "expression" | "json"
  spec?: StylePropertySpecification | undefined
};
type InputJsonInternalProps = InputJsonProps & WithTranslation;

type InputJsonState = {
  isEditing: boolean
  prevValue: string
};

class InputJsonInternal extends React.Component<InputJsonInternalProps, InputJsonState> {
  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
  };
  _view: EditorView | undefined;
  _el: HTMLDivElement | null = null;
  _cancelNextChange: boolean = false;

  constructor(props: InputJsonInternalProps) {
    super(props);
    this.state = {
      isEditing: false,
      prevValue: this.getPrettyJson(this.props.value),
    };
  }

  getPrettyJson(data: any) {
    return stringifyPretty(data, {indent: 2, maxLength: 40});
  }

  componentDidMount () {
    this._view = createEditor({
      parent: this._el!,
      value: this.getPrettyJson(this.props.value),
      lintType: this.props.lintType || "layer",
      onChange: (value:string) => this.onChange(value),
      onFocus: () => this.onFocus(),
      onBlur: () => this.onBlur(),
      spec: this.props.spec
    });
  }

  onFocus = () => {
    if (this.props.onFocus) this.props.onFocus();
    this.setState({
      isEditing: true,
    });
  };

  onBlur = () => {
    if (this.props.onBlur) this.props.onBlur();
    this.setState({
      isEditing: false,
    });
  };

  componentDidUpdate(prevProps: InputJsonProps) {
    if (!this.state.isEditing && prevProps.value !== this.props.value) {
      this._cancelNextChange = true;
      this._view!.dispatch({
        changes: {
          from: 0,
          to: this._view!.state.doc.length,
          insert: this.getPrettyJson(this.props.value)
        }
      });
    }
  }

  onChange = (_e: unknown) => {
    if (this._cancelNextChange) {
      this._cancelNextChange = false;
      this.setState({
        prevValue: this._view!.state.doc.toString(),
      });
      return;
    }
    const newCode = this._view!.state.doc.toString();

    if (this.state.prevValue !== newCode) {
      let parsedLayer, err;
      try {
        parsedLayer = JSON.parse(newCode);
      } catch(_err) {
        err = _err;
        console.warn(_err);
      }

      if (!err) {
        if (this.props.onChange) this.props.onChange(parsedLayer);
      }
    }

    this.setState({
      prevValue: newCode,
    });
  };

  render() {
    const style = {} as {maxHeight?: number};
    if (this.props.maxHeight) {
      style.maxHeight = this.props.maxHeight;
    }

    return <div className="json-editor" data-wd-key="json-editor" aria-hidden="true" style={{cursor: "text"}}>
      <div
        className={classnames("codemirror-container", this.props.className)}
        ref={(el) => {this._el = el;}}
        style={style}
      />
    </div>;
  }
}

const InputJson = withTranslation()(InputJsonInternal);
export default InputJson;
