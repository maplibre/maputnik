import type React from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import Block from "./Block";
import InputString from "./InputString";

type FieldCommentInternalProps = {
  value?: string;
  onChange(value: string | undefined): unknown;
  error: { message: string };
} & WithTranslation;

const FieldCommentInternal: React.FC<FieldCommentInternalProps> = (props) => {
  const t = props.t;
  const fieldSpec = {
    doc: t(
      "Comments for the current layer. This is non-standard and not in the spec.",
    ),
  };

  return (
    <Block
      label={t("Comments")}
      fieldSpec={fieldSpec}
      data-wd-key="layer-comment"
      error={props.error}
    >
      <InputString
        multi={true}
        value={props.value}
        onChange={props.onChange}
        default={t("Comment...")}
        data-wd-key="layer-comment.input"
      />
    </Block>
  );
};

const FieldComment = withTranslation()(FieldCommentInternal);
export default FieldComment;
