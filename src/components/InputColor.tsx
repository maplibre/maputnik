import React, { useEffect, useMemo, useRef, useState } from "react";
import Color from "color";
import ChromePicker from "react-color/lib/components/chrome/Chrome";
import {type ColorResult} from "react-color";
import lodash from "lodash";

function formatColor(color: ColorResult): string {
  const rgb = color.rgb;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
}

export type InputColorProps = {
  onChange(...args: unknown[]): unknown
  name?: string
  value?: string
  doc?: string
  style?: object
  default?: string
  "aria-label"?: string
};

/*** Number fields with support for min, max and units and documentation*/
export const InputColor: React.FC<InputColorProps> = (props) => {
  const [pickerOpened, setPickerOpened] = useState(false);
  const colorInput = useRef<HTMLInputElement | null>(null);

  // Keep the latest `onChange` available to the throttled callback, which is
  // created only once so that throttling actually takes effect.
  const onChangeProp = useRef(props.onChange);
  useEffect(() => {
    onChangeProp.current = props.onChange;
  });

  const onChangeNoCheck = useMemo(
    () => lodash.throttle((v: string) => onChangeProp.current(v), 1000/30),
    []
  );

  //TODO: I much rather would do this with absolute positioning
  //but I am too stupid to get it to work together with fixed position
  //and scrollbars so I have to fallback to JavaScript
  const calcPickerOffset = () => {
    const elem = colorInput.current;
    if(elem) {
      const pos = elem.getBoundingClientRect();
      return {
        top: pos.top,
        left: pos.left + 196,
      };
    } else {
      return {
        top: 160,
        left: 555,
      };
    }
  };

  const togglePicker = () => {
    setPickerOpened(opened => !opened);
  };

  const getColor = () => {
    // Catch invalid color.
    try {
      return Color(props.value).rgb();
    }
    catch(err) {
      console.warn("Error parsing color: ", err);
      return Color("rgb(255,255,255)");
    }
  };

  const onChange = (v: string) => {
    props.onChange(v === "" ? undefined : v);
  };

  const offset = calcPickerOffset();
  const currentColor = getColor().object();
  const currentChromeColor = {
    r: currentColor.r,
    g: currentColor.g,
    b: currentColor.b,
    // Rename alpha -> a for ChromePicker
    a: currentColor.alpha!
  };

  const picker = <div
    className="maputnik-color-picker-offset"
    style={{
      position: "fixed",
      zIndex: 1,
      left: offset.left,
      top: offset.top,
    }}>
    <ChromePicker
      color={currentChromeColor}
      onChange={c => onChangeNoCheck(formatColor(c))}
    />
    <div
      className="maputnik-color-picker-offset"
      onClick={togglePicker}
      style={{
        zIndex: -1,
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      }}
    />
  </div>;

  const swatchStyle = {
    backgroundColor: props.value
  };

  return <div className="maputnik-color-wrapper">
    {pickerOpened && picker}
    <div className="maputnik-color-swatch" style={swatchStyle}></div>
    <input
      aria-label={props["aria-label"]}
      spellCheck="false"
      autoComplete="off"
      className="maputnik-color"
      ref={colorInput}
      onClick={togglePicker}
      style={props.style}
      name={props.name}
      placeholder={props.default}
      value={props.value ? props.value : ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>;
};
