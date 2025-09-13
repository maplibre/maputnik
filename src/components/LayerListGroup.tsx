import React from "react";
import Collapser from "./Collapser";

type LayerListGroupProps = {
  title: string;
  "data-wd-key"?: string;
  isActive: boolean;
  onActiveToggle(...args: unknown[]): unknown;
  "aria-controls"?: string;
};

export default class LayerListGroup extends React.Component<LayerListGroupProps> {
  render() {
    return (
      <li className="maputnik-layer-list-group">
        {/* biome-ignore lint/a11y/noStaticElementInteractions: This header acts as a clickable region controlling the group */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Interaction is also available via the nested button */}
        <div
          className="maputnik-layer-list-group-header"
          data-wd-key={`layer-list-group:${this.props["data-wd-key"]}`}
          onClick={(_e) => this.props.onActiveToggle(!this.props.isActive)}
        >
          <button
            type="button"
            className="maputnik-layer-list-group-title"
            aria-controls={this.props["aria-controls"]}
            aria-expanded={this.props.isActive}
          >
            {this.props.title}
          </button>
          <span className="maputnik-space" />
          <Collapser
            style={{ height: 14, width: 14 }}
            isCollapsed={this.props.isActive}
          />
        </div>
      </li>
    );
  }
}
