import React from 'react'
import PropTypes from 'prop-types'
import ScrollContainer from './ScrollContainer'

type AppLayoutProps = {
  toolbar: React.ReactElement
  layerList: React.ReactElement
  layerEditor?: React.ReactElement
  map: React.ReactElement
  bottom?: React.ReactElement
  modals?: React.ReactNode
};

class AppLayout extends React.Component<AppLayoutProps> {
  static childContextTypes = {
    reactIconBase: PropTypes.object
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
        {this.props.layerList}
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
      {this.props.modals}
    </div>
  }
}

export default AppLayout
