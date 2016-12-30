import React from 'react'

const ScrollContainer = (props) => {
  return <div style={{
    overflowX: "visible",
    overflowY: "scroll",
    bottom:0,
    left:0,
    right:0,
    top:1,
    position: "absolute",
  }}>
    {props.children}
  </div>
}

export default ScrollContainer
