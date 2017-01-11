import React from 'react'
import ScrollContainer from './ScrollContainer'

class AppLayout extends React.Component {
  static propTypes = {
    toolbar: React.PropTypes.element.isRequired,
    layerList: React.PropTypes.element.isRequired,
    layerEditor: React.PropTypes.element,
    map: React.PropTypes.element.isRequired,
    bottom: React.PropTypes.element,
  }

  static childContextTypes = {
    reactIconBase: React.PropTypes.object
  }

  getChildContext() {
    return {
      reactIconBase: { size: 14 }
    }
  }

  render() {
    return <div className="maputnik-layout">
      {this.props.toolbar}
      <div className="maputnik-layout-list">
        <ScrollContainer>
          {this.props.layerList}
        </ScrollContainer>
      </div>
      <div className="maputnik-layout-drawer">
        <ScrollContainer>
          {this.props.layerEditor}
        </ScrollContainer>
      </div>
      {this.props.map}
      {this.props.bottom && <div className="maputnik-layout-bottom">
          {this.props.bottom}
        </div>
      }
    </div>
  }
}

export default AppLayout
