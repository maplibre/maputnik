import React from "react";
import {
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

type LayerEditorGroupProps = {
  id?: string;
  "data-wd-key"?: string;
  title: string;
  isActive: boolean;
  children: React.ReactElement;
  onActiveToggle(active: boolean): unknown;
};

export default class LayerEditorGroup extends React.Component<LayerEditorGroupProps> {
  render() {
    return (
      <AccordionItem uuid={this.props.id}>
        <AccordionItemHeading
          className="maputnik-layer-editor-group"
          data-wd-key={"layer-editor-group:" + this.props["data-wd-key"]}
          onClick={(_e) => this.props.onActiveToggle(!this.props.isActive)}
        >
          <AccordionItemButton className="maputnik-layer-editor-group__button">
            <span style={{ flexGrow: 1, alignContent: "center" }}>
              {this.props.title}
            </span>
            <MdArrowDropUp
              size={"2em"}
              className="maputnik-layer-editor-group__button__icon maputnik-layer-editor-group__button__icon--up"
            ></MdArrowDropUp>
            <MdArrowDropDown
              size={"2em"}
              className="maputnik-layer-editor-group__button__icon maputnik-layer-editor-group__button__icon--down"
            ></MdArrowDropDown>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>{this.props.children}</AccordionItemPanel>
      </AccordionItem>
    );
  }
}
