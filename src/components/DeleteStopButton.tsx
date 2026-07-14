import React from "react";

import { InputButton } from "./InputButton";
import {MdDelete} from "react-icons/md";
import { type WithTranslation, withTranslation } from "react-i18next";


type DeleteStopButtonInternalProps = {
  onClick?(...args: unknown[]): unknown
} & WithTranslation;


const DeleteStopButtonInternal: React.FC<DeleteStopButtonInternalProps> = (props) => {
  const t = props.t;
  return <InputButton
    className="maputnik-delete-stop"
    onClick={props.onClick}
    title={t("Remove zoom level from stop")}
  >
    <MdDelete />
  </InputButton>;
};

export const DeleteStopButton = withTranslation()(DeleteStopButtonInternal);
