import React from 'react'
import Icon from '@mdi/react'
import {
  mdiMenuDown,
  mdiMenuUp
} from '@mdi/js';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';


type LayerEditorGroupProps = {
  "id"?: string
  "data-wd-key"?: string
  title: string
  isActive: boolean
  children: React.ReactElement
  onActiveToggle(active: boolean): unknown
};


export default class LayerEditorGroup extends React.Component<LayerEditorGroupProps> {
  render() {
    return <AccordionItem uuid={this.props.id}>
      <AccordionItemHeading className="maputnik-layer-editor-group"
        data-wd-key={"layer-editor-group:"+this.props["data-wd-key"]}
        onClick={_e => this.props.onActiveToggle(!this.props.isActive)}
      >
        <AccordionItemButton className="maputnik-layer-editor-group__button">
          <span style={{flexGrow: 1}}>{this.props.title}</span>
          <Icon
            path={mdiMenuUp}
            size={1}
            className="maputnik-layer-editor-group__button__icon maputnik-layer-editor-group__button__icon--up"
          />
          <Icon
            path={mdiMenuDown}
            size={1}
            className="maputnik-layer-editor-group__button__icon maputnik-layer-editor-group__button__icon--down"
          />
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {this.props.children}
      </AccordionItemPanel>
    </AccordionItem>
  }
}
