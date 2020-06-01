import React from 'react'
import PropTypes from 'prop-types'
import Collapser from './Collapser'

export default class LayerListGroup extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    "data-wd-key": PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    onActiveToggle: PropTypes.func.isRequired,
    'aria-controls': PropTypes.string,
  }

  render() {
    return <li className="maputnik-layer-list-group">
      <div className="maputnik-layer-list-group-header"
        data-wd-key={"layer-list-group:"+this.props["data-wd-key"]}
        onClick={e => this.props.onActiveToggle(!this.props.isActive)}
      >
        <button
          className="maputnik-layer-list-group-title"
          aria-controls={this.props['aria-controls']}
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
  }
}
