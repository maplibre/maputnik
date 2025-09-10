import React, { PropsWithChildren } from 'react'
import {MdClose} from 'react-icons/md'
import AriaModal from 'react-aria-modal'
import classnames from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

type ModalInternalProps = PropsWithChildren & {
  "data-wd-key"?: string
  isOpen: boolean
  title: string
  onOpenToggle(value: boolean): unknown
  underlayClickExits?: boolean
  className?: string
} & WithTranslation;


class ModalInternal extends React.Component<ModalInternalProps> {
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
    const t = this.props.t;
    if(this.props.isOpen) {
      return <AriaModal
        titleText={this.props.title}
        underlayClickExits={this.props.underlayClickExits}
        data-wd-key={this.props["data-wd-key"]}
        verticallyCenter={true}
        onExit={this.onClose}
        dialogClass='maputnik-modal-container'
      >
        <div className={classnames("maputnik-modal", this.props.className)}
          data-wd-key={this.props["data-wd-key"]}
        >
          <header className="maputnik-modal-header">
            <h1 className="maputnik-modal-header-title">{this.props.title}</h1>
            <span className="maputnik-space"></span>
            <button className="maputnik-modal-header-toggle"
              title={t("Close modal")}
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

const Modal = withTranslation()(ModalInternal);
export default Modal;
