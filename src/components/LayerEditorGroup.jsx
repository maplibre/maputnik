import React from 'react'
import PropTypes from 'prop-types'
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


export default class LayerEditorGroup extends React.Component {
  static propTypes = {
    "id": PropTypes.string,
    "data-wd-key": PropTypes.string,
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired,
    onActiveToggle: PropTypes.func.isRequired
  }

  render() {
    return <AccordionItem uuid={this.props.id}>
      <AccordionItemHeading className="maputnik-layer-editor-group"
        data-wd-key={"layer-editor-group:"+this.props["data-wd-key"]}
        onClick={e => this.props.onActiveToggle(!this.props.isActive)}
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
