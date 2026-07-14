import React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";

import { InputButton } from "../InputButton";
import { Modal } from "./Modal";


type ModalLoadingInternalProps = {
  isOpen: boolean
  onCancel(...args: unknown[]): unknown
  title: string
  message: React.ReactNode
} & WithTranslation;


const ModalLoadingInternal: React.FC<ModalLoadingInternalProps> = (props) => {
  const t = props.t;
  return <Modal
    data-wd-key="modal:loading"
    isOpen={props.isOpen}
    underlayClickExits={false}
    title={props.title}
    onOpenToggle={() => props.onCancel()}
  >
    <p>
      {props.message}
    </p>
    <p className="maputnik-dialog__buttons">
      <InputButton onClick={(e) => props.onCancel(e)}>
        {t("Cancel")}
      </InputButton>
    </p>
  </Modal>;
};

export const ModalLoading = withTranslation()(ModalLoadingInternal);
