import React from "react";

type ScrollContainerProps = {
  children?: React.ReactNode
};

export const ScrollContainer: React.FC<ScrollContainerProps> = (props) => {
  return <div className="maputnik-scroll-container">
    {props.children}
  </div>;
};
