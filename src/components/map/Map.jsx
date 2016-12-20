import React from 'react'
import Immutable from 'immutable'

export default class Map extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accessToken: React.PropTypes.string,
  }

  shouldComponentUpdate(nextProps, nextState) {
    //TODO: If we enable this React mixin for immutable comparison we can remove this?
    return nextProps.mapStyle !== this.props.mapStyle
  }

  render() {
    return <div
    ref={x => this.container = x}
    style={{
      position: "fixed",
      top: 0,
      bottom: 0,
      height: "100%",
      width: "100%",
    }}></div>
  }
}
