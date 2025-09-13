import React, { type PropsWithChildren } from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import InputButton from "./InputButton";

type FilterEditorBlockInternalProps = PropsWithChildren & {
  onDelete(...args: unknown[]): unknown;
} & WithTranslation;

class FilterEditorBlockInternal extends React.Component<FilterEditorBlockInternalProps> {
  render() {
    const t = this.props.t;
    return (
      <div className="maputnik-filter-editor-block">
        <div className="maputnik-filter-editor-block-content">
          {this.props.children}
        </div>
        <div className="maputnik-filter-editor-block-action">
          <InputButton
            className="maputnik-icon-button"
            onClick={this.props.onDelete}
            title={t("Delete filter block")}
          >
            <MdDelete />
          </InputButton>
        </div>
      </div>
    );
  }
}

const FilterEditorBlock = withTranslation()(FilterEditorBlockInternal);
export default FilterEditorBlock;
