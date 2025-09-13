import React from "react";
import { Collapse as ReactCollapse } from "react-collapse";
import { reducedMotionEnabled } from "../libs/accessibility";

type CollapseProps = {
  isActive: boolean;
  children: React.ReactElement;
};

export default class Collapse extends React.Component<CollapseProps> {
  static defaultProps = {
    isActive: true,
  };

  render() {
    if (reducedMotionEnabled()) {
      return (
        <div style={{ display: this.props.isActive ? "block" : "none" }}>
          {this.props.children}
        </div>
      );
    } else {
      return (
        <ReactCollapse isOpened={this.props.isActive}>
          {this.props.children}
        </ReactCollapse>
      );
    }
  }
}
