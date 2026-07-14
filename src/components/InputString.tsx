import React, { useState } from "react";

export type InputStringProps = {
  "data-wd-key"?: string
  value?: string
  style?: object
  default?: string
  onChange?(value: string | undefined): unknown
  onInput?(value: string | undefined): unknown
  multi?: boolean
  required?: boolean
  disabled?: boolean
  spellCheck?: boolean
  "aria-label"?: string
  title?: string
};

export const InputString: React.FC<InputStringProps> = (props) => {
  const { onInput = () => {} } = props;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string | undefined>(props.value);

  // Replaces getDerivedStateFromProps: while the field is not being edited its
  // value tracks the prop, so an external change to the style is picked up.
  if (!editing && value !== props.value) {
    setValue(props.value);
  }

  let tag;
  let classes;

  if(props.multi) {
    tag = "textarea";
    classes = [
      "maputnik-string",
      "maputnik-string--multi"
    ];
  }
  else {
    tag = "input";
    classes = [
      "maputnik-string"
    ];
  }

  if(props.disabled) {
    classes.push("maputnik-string--disabled");
  }

  return React.createElement(tag, {
    "aria-label": props["aria-label"],
    "data-wd-key": props["data-wd-key"],
    spellCheck: Object.prototype.hasOwnProperty.call(props, "spellCheck") ? props.spellCheck : !(tag === "input"),
    disabled: props.disabled,
    className: classes.join(" "),
    style: props.style,
    value: value === undefined ? "" : value,
    placeholder: props.default,
    title: props.title,
    onChange: (e: React.BaseSyntheticEvent<Event, HTMLInputElement, HTMLInputElement>) => {
      setEditing(true);
      setValue(e.target.value);
      onInput(e.target.value);
    },
    onBlur: () => {
      // Note: editing is only cleared when the value actually changed; this
      // mirrors the original and keeps a no-op blur from resyncing the value.
      if(value !== props.value) {
        setEditing(false);
        if (props.onChange) props.onChange(value);
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.keyCode === 13 && props.onChange) {
        props.onChange(value);
      }
    },
    required: props.required,
  });
};
