import React from 'react'
import { WithTranslation, withTranslation } from 'react-i18next';

import InputButton from './InputButton'
import Modal from './Modal'

// @ts-ignore
import logoImage from 'maputnik-design/logos/logo-color.svg'

type ModalSurveyInternalProps = {
  isOpen: boolean
  onOpenToggle(...args: unknown[]): unknown
} & WithTranslation;

class ModalSurveyInternal extends React.Component<ModalSurveyInternalProps> {
  onClick = () => {
    window.open('https://gregorywolanski.typeform.com/to/cPgaSY', '_blank');

    this.props.onOpenToggle();
  }

  render() {
    const t = this.props.t;
    return <Modal
      data-wd-key="modal:survey"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={t("Maputnik Survey")}
    >
      <div className="maputnik-modal-survey">
        <img src={logoImage} className="maputnik-modal-survey__logo" />
        <h1>{t("You + Maputnik = Maputnik better for you")}</h1>
        <p className="maputnik-modal-survey__description">{t("We don’t track you, so we don’t know how you use Maputnik. Help us make Maputnik better for you by completing a 7–minute survey carried out by our contributing designer.")}</p>
        <InputButton onClick={this.onClick} className="maputnik-big-button maputnik-white-button maputnik-wide-button">{t("Take the Maputnik Survey")}</InputButton>
        <p className="maputnik-modal-survey__footnote">{t("It takes 7 minutes, tops! Every question is optional.")}</p>
      </div>
    </Modal>
  }
}

const ModalSurvey = withTranslation()(ModalSurveyInternal);
export default ModalSurvey;
