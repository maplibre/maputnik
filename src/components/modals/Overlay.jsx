import React from 'react'

class ViewportOverlay extends React.Component {
  static propTypes = {
    style: React.PropTypes.object
  }

  render() {
    const overlayStyle = {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 2,
      opacity: 0.875,
      backgroundColor: 'rgb(28, 31, 36)',
      ...this.props.style
    }

    return <div style={overlayStyle} />
  }
}

class Overlay extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    children: React.PropTypes.element.isRequired
  }

  render() {
    return <div style={{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      position: 'fixed',
      display: this.props.isOpen ? 'flex' : 'none',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <ViewportOverlay />
      <div style={{
        zIndex: 3,
      }}>
      {this.props.children}
      </div>
    </div>
  }
}

export default Overlay
