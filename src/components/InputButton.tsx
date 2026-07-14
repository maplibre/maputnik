import React from "react";
import classnames from "classnames";

type InputButtonProps = {
  "data-wd-key"?: string
  "aria-label"?: string
  onClick?(...args: unknown[]): unknown
  style?: object
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  type?: typeof HTMLButtonElement.prototype.type
  id?: string
  title?: string
};

export const InputButton: React.FC<InputButtonProps> = (props) => {
  return <button
    id={props.id}
    title={props.title}
    type={props.type}
    onClick={props.onClick}
    disabled={props.disabled}
    aria-label={props["aria-label"]}
    className={classnames("maputnik-button", props.className)}
    data-wd-key={props["data-wd-key"]}
    style={props.style}
  >
    {props.children}
  </button>;
};
