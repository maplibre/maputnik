import React, { type PropsWithChildren, type ReactElement } from "react";
import classnames from "classnames";
import FieldDocLabel from "./FieldDocLabel";
import Doc from "./Doc";
import generateUniqueId from "../libs/document-uid";

export type FieldsetProps = PropsWithChildren & {
  label?: string,
  fieldSpec?: { doc?: string },
  action?: ReactElement,
  error?: {message: string}
};


const Fieldset: React.FC<FieldsetProps> = (props) => {
  const [showDoc, setShowDoc] = React.useState(false);
  const labelId = React.useRef(generateUniqueId("fieldset_label_"));

  const onToggleDoc = (val: boolean) => {
    setShowDoc(val);
  };

  return (
    <div className="maputnik-input-block" role="group" aria-labelledby={labelId.current}>
      {props.fieldSpec && (
        <div className="maputnik-input-block-label">
          <FieldDocLabel
            label={props.label}
            onToggleDoc={onToggleDoc}
            fieldSpec={props.fieldSpec}
          />
        </div>
      )}
      {!props.fieldSpec && (
        <div className={classnames({
          "maputnik-input-block-label": true,
          "maputnik-input-block--error": props.error
        })}>
          {props.label}
        </div>
      )}
      <div className="maputnik-input-block-action">{props.action}</div>
      <div className="maputnik-input-block-content">{props.children}</div>
      {props.fieldSpec && (
        <div className="maputnik-doc-inline" style={{ display: showDoc ? "" : "none" }}>
          <Doc fieldSpec={props.fieldSpec} />
        </div>
      )}
    </div>
  );
};

export default Fieldset;
