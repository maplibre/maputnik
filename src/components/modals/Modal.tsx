import React, { type PropsWithChildren } from "react";
import {MdClose} from "react-icons/md";
import AriaModal from "react-aria-modal";
import classnames from "classnames";
import { type WithTranslation, withTranslation } from "react-i18next";

type ModalInternalProps = PropsWithChildren & {
  "data-wd-key"?: string
  isOpen: boolean
  title: string
  onOpenToggle(): void
  underlayClickExits?: boolean
  className?: string
} & WithTranslation;


const ModalInternal: React.FC<ModalInternalProps> = ({underlayClickExits = true, ...props}) => {
  // See <https://github.com/maplibre/maputnik/issues/416>
  const onClose = () => {
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }

    setTimeout(() => {
      props.onOpenToggle();
    }, 0);
  };

  const t = props.t;
  if(props.isOpen) {
    return <AriaModal
      titleText={props.title}
      underlayClickExits={underlayClickExits}
      data-wd-key={props["data-wd-key"]}
      verticallyCenter={true}
      onExit={onClose}
      dialogClass='maputnik-modal-container'
    >
      <div className={classnames("maputnik-modal", props.className)}
        data-wd-key={props["data-wd-key"]}
      >
        <header className="maputnik-modal-header">
          <h1 className="maputnik-modal-header-title">{props.title}</h1>
          <span className="maputnik-space"></span>
          <button className="maputnik-modal-header-toggle"
            title={t("Close modal")}
            onClick={onClose}
            data-wd-key={props["data-wd-key"]+".close-modal"}
          >
            <MdClose />
          </button>
        </header>
        <div className="maputnik-modal-scroller">
          <div className="maputnik-modal-content">{props.children}</div>
        </div>
      </div>
    </AriaModal>;
  }
  else {
    return false;
  }
};

export const Modal = withTranslation()(ModalInternal);
