import React from 'react'
import PropTypes from 'prop-types'

import InputButton from './InputButton'
import Modal from './Modal'

import logoImage from 'maputnik-design/logos/logo-color.svg'

export default class ModalSurvey extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  onClick = () => {
    window.open('https://gregorywolanski.typeform.com/to/cPgaSY', '_blank');

    this.props.onOpenToggle();
  }

  render() {
    return <Modal
      data-wd-key="modal:survey"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title="Maputnik Survey"
    >
      <div className="maputnik-modal-survey">
        <img src={logoImage} className="maputnik-modal-survey__logo" />
        <h1>You + Maputnik = Maputnik better for you</h1>
        <p className="maputnik-modal-survey__description">We don’t track you, so we don’t know how you use Maputnik. Help us make Maputnik better for you by completing a 7–minute survey carried out by our contributing designer.</p>
        <InputButton onClick={this.onClick} className="maputnik-big-button maputnik-white-button maputnik-wide-button">Take the Maputnik Survey</InputButton>
        <p className="maputnik-modal-survey__footnote">It takes 7 minutes, tops! Every question is optional.</p>
      </div>
    </Modal>
  }
}

