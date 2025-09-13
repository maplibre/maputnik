import React, { type JSX } from "react";
import { MdHighlightOff, MdInfoOutline } from "react-icons/md";

type FieldDocLabelProps = {
  label: JSX.Element | string | undefined;
  fieldSpec?: {
    doc?: string;
  };
  onToggleDoc?(...args: unknown[]): unknown;
};

const FieldDocLabel: React.FC<FieldDocLabelProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  const onToggleDoc = (state: boolean) => {
    setOpen(state);
    if (props.onToggleDoc) {
      props.onToggleDoc(state);
    }
  };

  const { label, fieldSpec } = props;
  const { doc } = fieldSpec || {};

  if (doc) {
    return (
      <div className="maputnik-doc-wrapper">
        <div className="maputnik-doc-target">
          {label}
          {"\xa0"}
          <button
            type="button"
            aria-label={
              open
                ? "close property documentation"
                : "open property documentation"
            }
            className={`maputnik-doc-button maputnik-doc-button--${open ? "open" : "closed"}`}
            onClick={() => onToggleDoc(!open)}
            data-wd-key={`field-doc-button-${label}`}
          >
            {open ? <MdHighlightOff /> : <MdInfoOutline />}
          </button>
        </div>
      </div>
    );
  } else if (label) {
    return (
      <div className="maputnik-doc-wrapper">
        <div className="maputnik-doc-target">{label}</div>
      </div>
    );
  }
  return <div />;
};

export default FieldDocLabel;
