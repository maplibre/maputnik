import React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import "./SmallError.scss";


type SmallErrorInternalProps = {
  children?: React.ReactNode
} & WithTranslation;

const SmallErrorInternal: React.FC<SmallErrorInternalProps> = (props) => {
  const t = props.t;
  return (
    <div className="SmallError">
      {t("Error:")} {props.children}
    </div>
  );
};

export const SmallError = withTranslation()(SmallErrorInternal);
