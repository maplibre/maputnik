import React from 'react'
import PropTypes from 'prop-types'
import Collapser from './Collapser'

export default class LayerListGroup extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onActiveToggle: PropTypes.func.isRequired
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
