import React from 'react'
import PropTypes from 'prop-types'
import ScrollContainer from './ScrollContainer'
import { WithTranslation, withTranslation } from 'react-i18next';

type AppLayoutInternalProps = {
  toolbar: React.ReactElement
  layerList: React.ReactElement
  layerEditor?: React.ReactElement
  map: React.ReactElement
  bottom?: React.ReactElement
  modals?: React.ReactNode
} & WithTranslation;

class AppLayoutInternal extends React.Component<AppLayoutInternalProps> {
  static childContextTypes = {
    reactIconBase: PropTypes.object
  }

  getChildContext() {
    return {
      reactIconBase: { size: 14 }
    }
  }

  render() {
    document.body.dir = this.props.i18n.dir();

    return <div className="maputnik-layout">
      {this.props.toolbar}
      <div className="maputnik-layout-main">
        <div className="maputnik-layout-list">
          {this.props.layerList}
        </div>
        <div className="maputnik-layout-drawer">
          <ScrollContainer>
            {this.props.layerEditor}
          </ScrollContainer>
        </div>
        {this.props.map}
      </div>
      {this.props.bottom && <div className="maputnik-layout-bottom">
        {this.props.bottom}
      </div>
      }
      {this.props.modals}
    </div>
  }
}

const AppLayout = withTranslation()(AppLayoutInternal);
export default AppLayout;
