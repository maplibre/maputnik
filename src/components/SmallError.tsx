import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import "./SmallError.scss";


type SmallErrorInternalProps = {
  children?: React.ReactNode
} & WithTranslation;

class SmallErrorInternal extends React.Component<SmallErrorInternalProps> {
  render () {
    const t = this.props.t;
    return (
      <div className="SmallError">
        {t("Error:")} {this.props.children}
      </div>
    );
  }
}

const SmallError = withTranslation()(SmallErrorInternal);
export default SmallError;
