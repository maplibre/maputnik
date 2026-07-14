import React from "react";
import {MdArrowDropDown, MdArrowDropUp} from "react-icons/md";

type CollapserProps = {
  isCollapsed: boolean
  style?: object
};

export const Collapser: React.FC<CollapserProps> = (props) => {
  const iconStyle = {
    width: 20,
    height: 20,
    ...props.style,
  };
  return props.isCollapsed ? <MdArrowDropUp style={iconStyle}/> : <MdArrowDropDown style={iconStyle} />;
};
