import React from 'react'

import InputButton from './InputButton'
import Modal from './Modal'
import { WithTranslation, withTranslation } from 'react-i18next';


type ModalLoadingInternalProps = {
  isOpen: boolean
  onCancel(...args: unknown[]): unknown
  title: string
  message: React.ReactNode
} & WithTranslation;


class ModalLoadingInternal extends React.Component<ModalLoadingInternalProps> {
  underlayOnClick(e: Event) {
    // This stops click events falling through to underlying modals.
    e.stopPropagation();
  }

  render() {
    const t = this.props.t;
    return <Modal
      data-wd-key="modal:loading"
      isOpen={this.props.isOpen}
      underlayClickExits={false}
      underlayProps={{
        // @ts-ignore
        onClick: (e: Event) => underlayProps(e)  
      }}
      title={this.props.title}
      onOpenToggle={() => this.props.onCancel()}
    >
      <p>
        {this.props.message}
      </p>
      <p className="maputnik-dialog__buttons">
        <InputButton onClick={(e) => this.props.onCancel(e)}>
          {t("Cancel")}
        </InputButton>
      </p>
    </Modal>
  }
}

const ModalLoading = withTranslation()(ModalLoadingInternal);
export default ModalLoading;
