import React from 'react'

import InputButton from './InputButton'
import Modal from './Modal'


type ModalLoadingProps = {
  isOpen: boolean
  onCancel(...args: unknown[]): unknown
  title: string
  message: React.ReactNode
};


export default class ModalLoading extends React.Component<ModalLoadingProps> {
  underlayOnClick(e: Event) {
    // This stops click events falling through to underlying modals.
    e.stopPropagation();
  }

  render() {
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
          Cancel
        </InputButton>
      </p>
    </Modal>
  }
}

