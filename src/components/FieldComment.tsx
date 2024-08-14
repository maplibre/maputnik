import React from 'react'

import Block from './Block'
import InputString from './InputString'
import { WithTranslation, withTranslation } from 'react-i18next';

type FieldCommentProps = {
  value?: string
  onChange(value: string | undefined): unknown
  error: {message: string}
};

class IFieldComment extends React.Component<FieldCommentProps & WithTranslation> {
  render() {
    const t = this.props.t;
    const fieldSpec = {
      doc: t("Comments for the current layer. This is non-standard and not in the spec."),
    };

    return <Block
      label={t("Comments")}
      fieldSpec={fieldSpec}
      data-wd-key="layer-comment"
      error={this.props.error}
    >
      <InputString
        multi={true}
        value={this.props.value}
        onChange={this.props.onChange}
        default={t("Comment...")}
        data-wd-key="layer-comment.input"
      />
    </Block>
  }
}

const FieldComment = withTranslation()(IFieldComment);
export default FieldComment;
