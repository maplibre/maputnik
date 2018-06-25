import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import Modal from './Modal'

import Logo from './../../img/maputnik.png'

class SurveyModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  constructor(props) { super(props); }

  render() {
    return <Modal
      data-wd-key="modal-survey"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Maputnik Survey'}
    >
      <div style={{width: 372, paddingBottom: "0"}}>
        <img src="./../../img/maputnik.png" alt="" width="128" style={{display:"block",margin:"0 auto"}} />
        <h1>You + Maputnik = Maputnik better for you</h1>
        <p style={{lineHeight:1.5}}>We don’t track you, so we don’t know how you use Maputnik. Help us make Maputnik better for you by completing a 7–minute survey carried out by our contributing designer.
</p>
        <a href="https://gregorywolanski.typeform.com/to/cPgaSY" target="_blank" rel="noopener noreferrer" className="maputnik-button maputnik-big-button maputnik-white-button maputnik-green-hover-button maputnik-wide-button">Take the Maputnik Survey</a>
        <p className="green" style={{margin:"16px 0 0"}}>It takes 7 minutes, tops! Every question is optional.</p>
      </div>
    </Modal>
  }
}

export default SurveyModal
