import React from "react";

export type InputCheckboxProps = {
  value?: boolean
  style?: object
  onChange(...args: unknown[]): unknown
};

export const InputCheckbox: React.FC<InputCheckboxProps> = ({value = false, ...props}) => {
  const onChange = () => {
    props.onChange(!value);
  };

  return <div className="maputnik-checkbox-wrapper">
    <input
      className="maputnik-checkbox"
      type="checkbox"
      style={props.style}
      onChange={onChange}
      onClick={onChange}
      checked={value}
    />
    <div className="maputnik-checkbox-box">
      <svg style={{
        display: value ? "inline" : "none"
      }} className="maputnik-checkbox-icon" viewBox='0 0 32 32'>
        <path d='M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z' />
      </svg>
    </div>
  </div>;
};
