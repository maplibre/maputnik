import React, {type CSSProperties, type PropsWithChildren, type SyntheticEvent, useRef, useState} from "react";
import classnames from "classnames";
import { FieldDocLabel } from "./FieldDocLabel";
import { Doc } from "./Doc";

export type BlockProps = PropsWithChildren & {
  "data-wd-key"?: string
  label?: string
  action?: React.ReactElement
  style?: CSSProperties
  onChange?(...args: unknown[]): unknown
  fieldSpec?: object
  wideMode?: boolean
  error?: {message: string}
};

/** Wrap a component with a label */
export const Block: React.FC<BlockProps> = (props) => {
  const [showDoc, setShowDoc] = useState(false);
  const blockEl = useRef<HTMLDivElement | null>(null);

  const onToggleDoc = (val: boolean) => {
    setShowDoc(val);
  };

  /**
   * Some fields for example <InputColor/> bind click events inside the element
   * to close the picker. This in turn propagates to the <label/> element
   * causing the picker to reopen. This causes a scenario where the picker can
   * never be closed once open.
   */
  const onLabelClick = (event: SyntheticEvent<any, any>) => {
    const el = event.nativeEvent.target;
    const contains = blockEl.current?.contains(el);

    if (event.nativeEvent.target.nodeName !== "INPUT" && !contains) {
      event.stopPropagation();
    }
    if (event.nativeEvent.target.nodeName !== "A") {
      event.preventDefault();
    }
  };

  return <label style={props.style}
    data-wd-key={props["data-wd-key"]}
    className={classnames({
      "maputnik-input-block": true,
      "maputnik-input-block--wide": props.wideMode,
      "maputnik-action-block": props.action,
      "maputnik-input-block--error": props.error
    })}
    onClick={onLabelClick}
  >
    {props.fieldSpec &&
      <div className="maputnik-input-block-label">
        <FieldDocLabel
          label={props.label}
          onToggleDoc={onToggleDoc}
          fieldSpec={props.fieldSpec}
        />
      </div>
    }
    {!props.fieldSpec &&
      <div className="maputnik-input-block-label">
        {props.label}
      </div>
    }
    <div className="maputnik-input-block-action">
      {props.action}
    </div>
    <div className="maputnik-input-block-content" ref={blockEl}>
      {props.children}
    </div>
    {props.fieldSpec &&
      <div
        className="maputnik-doc-inline"
        style={{display: showDoc ? "" : "none"}}
      >
        <Doc fieldSpec={props.fieldSpec} />
      </div>
    }
  </label>;
};
