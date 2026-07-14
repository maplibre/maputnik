import React from "react";
import {MdArrowDropDown, MdArrowDropUp} from "react-icons/md";
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";


type LayerEditorGroupProps = {
  "id"?: string
  "data-wd-key"?: string
  title: string
  isActive: boolean
  children: React.ReactElement
  onActiveToggle(active: boolean): unknown
};


export const LayerEditorGroup: React.FC<LayerEditorGroupProps> = (props) => {
  return <AccordionItem uuid={props.id}>
    <AccordionItemHeading className="maputnik-layer-editor-group"
      data-wd-key={"layer-editor-group:"+props["data-wd-key"]}
      onClick={_e => props.onActiveToggle(!props.isActive)}
    >
      <AccordionItemButton className="maputnik-layer-editor-group__button">
        <span style={{flexGrow: 1, alignContent: "center"}}>{props.title}</span>
        <MdArrowDropUp size={"2em"} className="maputnik-layer-editor-group__button__icon maputnik-layer-editor-group__button__icon--up"></MdArrowDropUp>
        <MdArrowDropDown size={"2em"} className="maputnik-layer-editor-group__button__icon maputnik-layer-editor-group__button__icon--down"></MdArrowDropDown>
      </AccordionItemButton>
    </AccordionItemHeading>
    <AccordionItemPanel>
      {props.children}
    </AccordionItemPanel>
  </AccordionItem>;
};
