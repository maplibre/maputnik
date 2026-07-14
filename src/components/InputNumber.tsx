import React, { type BaseSyntheticEvent, useRef, useState } from "react";

export type InputNumberProps = {
  value?: number
  default?: number
  min?: number
  max?: number
  onChange?(value: number | undefined): unknown
  allowRange?: boolean
  rangeStep?: number
  "data-wd-key"?: string
  required?: boolean
  "aria-label"?: string
};

export const InputNumber: React.FC<InputNumberProps> = (props) => {
  const { rangeStep = 1 } = props;

  const [editing, setEditing] = useState(false);
  const [editingRange, setEditingRange] = useState(false);
  const [value, setValue] = useState<number | undefined>(props.value);
  /** The value currently being edited. It can be an invalid value. */
  const [dirtyValue, setDirtyValue] = useState<number | string | undefined>(props.value);

  const keyboardEvent = useRef(false);

  // Replaces getDerivedStateFromProps: while not editing, track the prop.
  if (!editing && props.value !== value) {
    setValue(props.value);
    setDirtyValue(props.value);
  }

  function isValid(v: number | string | undefined) {
    if (v === undefined) {
      return true;
    }

    const val = +v;
    if(isNaN(val)) {
      return false;
    }

    if(!isNaN(props.min!) && val < props.min!) {
      return false;
    }

    if(!isNaN(props.max!) && val > props.max!) {
      return false;
    }

    return true;
  }

  function changeValue(newValue: number | string | undefined) {
    const val = (newValue === "" || newValue === undefined) ?
      undefined : +newValue;

    const hasChanged = props.value !== val;
    if(isValid(val) && hasChanged) {
      if (props.onChange) props.onChange(val);
      setValue(val);
    }
    else if (!isValid(val) && hasChanged) {
      setValue(undefined);
    }

    setDirtyValue(newValue === "" ? undefined : newValue);
  }

  const resetValue = () => {
    setEditing(false);
    // Reset explicitly to default value if value has been cleared
    if(!value) {
      return;
    }

    // If set value is invalid fall back to the last valid value from props or at last resort the default value
    if (!isValid(value)) {
      if(isValid(props.value)) {
        changeValue(props.value);
        setDirtyValue(props.value);
      } else {
        changeValue(undefined);
        setDirtyValue(undefined);
      }
    }
  };

  const onChangeRange = (e: BaseSyntheticEvent<Event, HTMLInputElement, HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value);
    const step = rangeStep;
    let newDirtyValue = newValue;

    if(step) {
      // Can't do this with the <input/> range step attribute else we won't be able to set a high precision value via the text input.
      const snap = newValue % step;

      // Round up/down to step
      if (keyboardEvent.current) {
        // If it's keyboard event we might get a low positive/negative value,
        // for example we might go from 13 to 13.23, however because we know
        // that came from a keyboard event we always want to increase by a
        // single step value.
        if (newValue < +dirtyValue!) {
          newValue = value! - step;
        }
        else {
          newValue = value! + step;
        }
        newDirtyValue = newValue;
      }
      else {
        if (snap < step/2) {
          newValue = newValue - snap;
        }
        else {
          newValue = newValue + (step - snap);
        }
      }
    }

    keyboardEvent.current = false;

    // Clamp between min/max
    newValue = Math.max(props.min!, Math.min(props.max!, newValue));

    setValue(newValue);
    setDirtyValue(newDirtyValue);
    if (props.onChange) props.onChange(newValue);
  };

  if(
    Object.prototype.hasOwnProperty.call(props, "min") &&
    Object.prototype.hasOwnProperty.call(props, "max") &&
    props.min !== undefined && props.max !== undefined &&
    props.allowRange
  ) {
    const currentValue = editing ? dirtyValue : value;
    const defaultValue = props.default === undefined ? "" : props.default;
    let inputValue;
    if (editingRange) {
      inputValue = value;
    }
    else {
      inputValue = currentValue;
    }

    return <div className="maputnik-number-container">
      <input
        className="maputnik-number-range"
        key="range"
        type="range"
        max={props.max}
        min={props.min}
        step="any"
        spellCheck="false"
        value={currentValue === undefined ? defaultValue : currentValue}
        onChange={onChangeRange}
        onKeyDown={() => {
          keyboardEvent.current = true;
        }}
        onPointerDown={() => {
          setEditing(true);
          setEditingRange(true);
        }}
        onPointerUp={() => {
          // Safari doesn't get onBlur event
          setEditing(false);
          setEditingRange(false);
        }}
        onBlur={() => {
          setEditing(false);
          setEditingRange(false);
          setDirtyValue(value);
        }}
        data-wd-key={props["data-wd-key"] + "-range"}
      />
      <input
        key="text"
        type="text"
        spellCheck="false"
        className="maputnik-number"
        placeholder={props.default?.toString()}
        value={inputValue === undefined ? "" : inputValue}
        onFocus={_e => {
          setEditing(true);
        }}
        onChange={e => {
          changeValue(e.target.value);
        }}
        onBlur={_e => {
          setEditing(false);
          resetValue();
        }}
        data-wd-key={props["data-wd-key"] + "-text"}

      />
    </div>;
  }
  else {
    const currentValue = editing ? dirtyValue : value;

    return <input
      aria-label={props["aria-label"]}
      spellCheck="false"
      className="maputnik-number"
      placeholder={props.default?.toString()}
      value={currentValue === undefined ? "" : currentValue}
      onChange={e => changeValue(e.target.value)}
      onFocus={() => {
        setEditing(true);
      }}
      onBlur={resetValue}
      required={props.required}
      data-wd-key={props["data-wd-key"]}
    />;
  }
};
