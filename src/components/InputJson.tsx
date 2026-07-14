import React, { useEffect, useRef } from "react";
import classnames from "classnames";
import { type WithTranslation, withTranslation } from "react-i18next";

import { type EditorView } from "@codemirror/view";
import stringifyPretty from "json-stringify-pretty-compact";

import {createEditor} from "../libs/codemirror-editor-factory";
import type { StylePropertySpecification } from "maplibre-gl";
import type { TransactionSpec } from "@codemirror/state";

export type InputJsonProps = {
  value: object
  className?: string
  onChange(object: object): void
  onFocus?(...args: unknown[]): unknown
  onBlur?(...args: unknown[]): unknown
  lintType: "layer" | "style" | "expression" | "json"
  spec?: StylePropertySpecification | undefined
  /**
   * When setting this and using search and replace, the editor will scroll to the selected text
   * Use this only when the editor is the only element in the page.
   */
  withScroll?: boolean
};
type InputJsonInternalProps = InputJsonProps & WithTranslation;

function getPrettyJson(data: any) {
  return stringifyPretty(data, {indent: 2, maxLength: 40});
}

const InputJsonInternal: React.FC<InputJsonInternalProps> = ({
  value,
  className,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  lintType,
  spec,
  withScroll = false,
}) => {
  const el = useRef<HTMLDivElement | null>(null);
  const view = useRef<EditorView | undefined>(undefined);
  const cancelNextChange = useRef<boolean>(false);
  // `isEditing` and `prevValue` are never rendered, they are only read from the
  // CodeMirror callbacks, so refs keep them up to date without re-rendering.
  const isEditing = useRef<boolean>(false);
  const prevValue = useRef<string>(getPrettyJson(value));
  // Mirrors `prevProps.value` from the previous `componentDidUpdate`.
  const prevValueProp = useRef<object>(value);

  const handleFocus = () => {
    if (onFocus) onFocus();
    isEditing.current = true;
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
    isEditing.current = false;
  };

  const handleChange = () => {
    if (cancelNextChange.current) {
      cancelNextChange.current = false;
      prevValue.current = view.current!.state.doc.toString();
      return;
    }
    const newCode = view.current!.state.doc.toString();

    if (prevValue.current !== newCode) {
      let parsedLayer, err;
      try {
        parsedLayer = JSON.parse(newCode);
      } catch(_err) {
        err = _err;
        console.warn(_err);
      }

      if (!err) {
        if (onChange) onChange(parsedLayer);
      }
    }

    prevValue.current = newCode;
  };

  // The editor is created once on mount, so its callbacks have to go through a
  // ref to always see the latest props.
  const handlers = useRef({handleChange, handleFocus, handleBlur});
  useEffect(() => {
    handlers.current = {handleChange, handleFocus, handleBlur};
  });

  useEffect(() => {
    view.current = createEditor({
      parent: el.current!,
      value: getPrettyJson(value),
      lintType: lintType || "layer",
      onChange: () => handlers.current.handleChange(),
      onFocus: () => handlers.current.handleFocus(),
      onBlur: () => handlers.current.handleBlur(),
      spec: spec
    });
    // Runs once on mount, mirroring the previous componentDidMount.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: adding deps would rebuild the editor on every change
  }, []);

  useEffect(() => {
    // Only react to an actual change of the `value` prop, which also skips the
    // initial mount (the editor is created with the value already).
    if (prevValueProp.current === value) return;
    prevValueProp.current = value;

    if (isEditing.current) return;

    cancelNextChange.current = true;
    const transactionSpec: TransactionSpec = {
      changes: {
        from: 0,
        to: view.current!.state.doc.length,
        insert: getPrettyJson(value)
      }
    };
    if (withScroll) {
      transactionSpec.selection = view.current!.state.selection;
      transactionSpec.scrollIntoView = true;
    }
    view.current!.dispatch(transactionSpec);
  }, [value, withScroll]);

  return <div className="json-editor" data-wd-key="json-editor" aria-hidden="true" style={{cursor: "text"}}>
    <div
      className={classnames("codemirror-container", className)}
      ref={el}
    />
  </div>;
};

export const InputJson = withTranslation()(InputJsonInternal);
