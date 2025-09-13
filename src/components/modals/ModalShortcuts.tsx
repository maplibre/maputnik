import React from "react";
import { Trans, type WithTranslation, withTranslation } from "react-i18next";

import Modal from "./Modal";


type ModalShortcutsInternalProps = {
  isOpen: boolean
  onOpenToggle(...args: unknown[]): unknown
} & WithTranslation;


class ModalShortcutsInternal extends React.Component<ModalShortcutsInternalProps> {
  render() {
    const t = this.props.t;
    const help = [
      {
        key: <kbd>?</kbd>,
        text: t("Shortcuts menu")
      },
      {
        key: <kbd>o</kbd>,
        text: t("Open modal")
      },
      {
        key: <kbd>e</kbd>,
        text: t("Export modal")
      },
      {
        key: <kbd>d</kbd>,
        text: t("Data Sources modal")
      },
      {
        key: <kbd>s</kbd>,
        text: t("Style Settings modal")
      },
      {
        key: <kbd>i</kbd>,
        text: t("Toggle inspect")
      },
      {
        key: <kbd>m</kbd>,
        text: t("Focus map")
      },
      {
        key: <kbd>!</kbd>,
        text: t("Debug modal")
      },
    ];


    const mapShortcuts = [
      {
        key: <kbd>+</kbd>,
        text: t("Increase the zoom level by 1.",)
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>+</kbd></>,
        text: t("Increase the zoom level by 2.",)
      },
      {
        key: <kbd>-</kbd>,
        text: t("Decrease the zoom level by 1.",)
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>-</kbd></>,
        text: t("Decrease the zoom level by 2.",)
      },
      {
        key: <kbd>Up</kbd>,
        text: t("Pan up by 100 pixels.",)
      },
      {
        key: <kbd>Down</kbd>,
        text: t("Pan down by 100 pixels.",)
      },
      {
        key: <kbd>Left</kbd>,
        text: t("Pan left by 100 pixels.",)
      },
      {
        key: <kbd>Right</kbd>,
        text: t("Pan right by 100 pixels.",)
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Right</kbd></>,
        text: t("Increase the rotation by 15 degrees.",)
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Left</kbd></>,
        text: t("Decrease the rotation by 15 degrees.")
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Up</kbd></>,
        text: t("Increase the pitch by 10 degrees.")
      },
      {
        key: <><kbd>Shift</kbd> + <kbd>Down</kbd></>,
        text: t("Decrease the pitch by 10 degrees.")
      },
    ];


    return <Modal
      data-wd-key="modal:shortcuts"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={t("Shortcuts")}
    >
      <section className="maputnik-modal-section maputnik-modal-shortcuts">
        <p>
          <Trans t={t}>
            Press <code>ESC</code> to lose focus of any active elements, then press one of:
          </Trans>
        </p>
        <dl>
          {help.map((item, idx) => {
            return <div key={idx} className="maputnik-modal-shortcuts__shortcut">
              <dt key={"dt"+idx}>{item.key}</dt>
              <dd key={"dd"+idx}>{item.text}</dd>
            </div>;
          })}
        </dl>
        <p>{t("If the Map is in focused you can use the following shortcuts")}</p>
        <ul>
          {mapShortcuts.map((item, idx) => {
            return <li key={idx}>
              <span>{item.key}</span> {item.text}
            </li>;
          })}
        </ul>
      </section>
    </Modal>;
  }
}

const ModalShortcuts = withTranslation()(ModalShortcutsInternal);
export default ModalShortcuts;
