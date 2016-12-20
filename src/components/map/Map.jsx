import React from 'react'

export default class Map extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    accessToken: React.PropTypes.string,
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
