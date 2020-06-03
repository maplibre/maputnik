import React from 'react'
import PropTypes from 'prop-types'

import Button from './Button'
import Modal from './Modal'


export default class ModalLoading extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired,
  }

  underlayOnClick(e) {
    // This stops click events falling through to underlying modals.
    e.stopPropagation();
  }

  render() {
    return <Modal
      data-wd-key="modal:loading"
      isOpen={this.props.isOpen}
      underlayClickExits={false}
      underlayProps={{
        onClick: (e) => underlayProps(e)
      }}
      closeable={false}
      title={this.props.title}
      onOpenToggle={() => this.props.onCancel()}
    >
      <p>
        {this.props.message}
      </p>
      <p className="maputnik-dialog__buttons">
        <Button onClick={(e) => this.props.onCancel(e)}>
          Cancel
        </Button>
      </p>
    </Modal>
  }
}

