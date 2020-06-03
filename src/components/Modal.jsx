import React from 'react'
import PropTypes from 'prop-types'
import {MdClose} from 'react-icons/md'
import AriaModal from 'react-aria-modal'
import classnames from 'classnames';


export default class Modal extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
    children: PropTypes.node,
    underlayClickExits: PropTypes.bool,
    underlayProps: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    underlayClickExits: true
  }

  // See <https://github.com/maputnik/editor/issues/416>
  onClose = () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }

    setImmediate(() => {
      this.props.onOpenToggle(false);
    });
  }

  getApplicationNode() {
    return document.getElementById('app');
  }

  render() {
    if(this.props.isOpen) {
      return <AriaModal
        titleText={this.props.title}
        underlayClickExits={this.props.underlayClickExits}
        underlayProps={this.props.underlayProps}
        getApplicationNode={this.getApplicationNode}
        data-wd-key={this.props["data-wd-key"]}
        verticallyCenter={true}
        onExit={this.onClose}
      >
        <div className={classnames("maputnik-modal", this.props.className)}
          data-wd-key={this.props["data-wd-key"]}
        >
          <header className="maputnik-modal-header">
            <h1 className="maputnik-modal-header-title">{this.props.title}</h1>
            <span className="maputnik-modal-header-space"></span>
            <button className="maputnik-modal-header-toggle"
              title="Close modal"
              onClick={this.onClose}
              data-wd-key={this.props["data-wd-key"]+".close-modal"}
            >
              <MdClose />
            </button>
          </header>
          <div className="maputnik-modal-scroller">
            <div className="maputnik-modal-content">{this.props.children}</div>
          </div>
        </div>
      </AriaModal>
    }
    else {
      return false;
    }
  }
}

