import React from 'react'
import { fullHeight } from './theme.js'
import Immutable from 'immutable'

export class Map extends React.Component {
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
      ...fullHeight,
      width: "100%",
    }}></div>
  }
}
