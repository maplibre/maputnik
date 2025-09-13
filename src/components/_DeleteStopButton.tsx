import React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import InputButton from "./InputButton";

type DeleteStopButtonInternalProps = {
  onClick?(...args: unknown[]): unknown;
} & WithTranslation;

class DeleteStopButtonInternal extends React.Component<DeleteStopButtonInternalProps> {
  render() {
    const t = this.props.t;
    return (
      <InputButton
        className="maputnik-delete-stop"
        onClick={this.props.onClick}
        title={t("Remove zoom level from stop")}
      >
        <MdDelete />
      </InputButton>
    );
  }
}

const DeleteStopButton = withTranslation()(DeleteStopButtonInternal);
export default DeleteStopButton;
