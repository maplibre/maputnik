import React from 'react'
import {MdClose} from 'react-icons/md'
import AriaModal from 'react-aria-modal'
import classnames from 'classnames';


type ModalProps = {
  "data-wd-key"?: string
  isOpen: boolean
  title: string
  onOpenToggle(value: boolean): unknown
  underlayClickExits?: boolean
  underlayProps?: any
  className?: string
};


export default class Modal extends React.Component<ModalProps> {
  static defaultProps = {
    underlayClickExits: true
  }

  // See <https://github.com/maplibre/maputnik/issues/416>
  onClose = () => {
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }

    setTimeout(() => {
      this.props.onOpenToggle(false);
    }, 0);
  }

  render() {
    if(this.props.isOpen) {
      return <AriaModal
        titleText={this.props.title}
        underlayClickExits={this.props.underlayClickExits}
        // @ts-ignore
        underlayProps={this.props.underlayProps}
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

