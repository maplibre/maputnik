import React from 'react'
import Collapser from './Collapser'

export default class LayerListGroup extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool.isRequired,
    onActiveToggle: React.PropTypes.func.isRequired
  }

  render() {
    return <div className="maputnik-layer-list-group">
      <div className="maputnik-layer-list-group-header"
        onClick={e => this.props.onActiveToggle(!this.props.isActive)}
      >
        <span className="maputnik-layer-list-group-title">{this.props.title}</span>
        <span className="maputnik-space" />
        <Collapser
          style={{ height: 14, width: 14 }}
          isCollapsed={this.props.isActive}
        />
      </div>
    </div>
  }
}
