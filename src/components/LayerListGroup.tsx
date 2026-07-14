import React from "react";
import { Collapser } from "./Collapser";

type LayerListGroupProps = {
  title: string
  "data-wd-key"?: string
  isActive: boolean
  onActiveToggle(...args: unknown[]): unknown
  "aria-controls"?: string
};

export const LayerListGroup: React.FC<LayerListGroupProps> = (props) => {
  return <li className="maputnik-layer-list-group">
    <div className="maputnik-layer-list-group-header"
      data-wd-key={"layer-list-group:"+props["data-wd-key"]}
      onClick={_e => props.onActiveToggle(!props.isActive)}
    >
      <button
        className="maputnik-layer-list-group-title"
        aria-controls={props["aria-controls"]}
        aria-expanded={props.isActive}
      >
        {props.title}
      </button>
      <span className="maputnik-space" />
      <Collapser
        style={{ height: 14, width: 14 }}
        isCollapsed={props.isActive}
      />
    </div>
  </li>;
};
