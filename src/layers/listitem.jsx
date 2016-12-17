import React from 'react'
import Radium from 'radium'
import Immutable from 'immutable'
import color from 'color'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import { LayerEditor } from './editor.jsx'
import scrollbars from '../scrollbars.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import theme from '../theme.js'
import {SortableElement, SortableHandle} from 'react-sortable-hoc';
import MdDragHandle from 'react-icons/lib/md/drag-handle'

const DragHandle = SortableHandle(() => <MdDragHandle />);

@SortableElement
@Radium
class LayerListItem extends React.Component {
  static propTypes = {
    layerId: React.PropTypes.string.isRequired,
    onLayerSelected: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return <li
      key={this.props.layerId}
      onClick={() => this.props.onLayerSelected(this.props.layerId)}
      style={{
        fontWeight: 400,
        color: theme.colors.lowgray,
        fontSize: theme.fontSizes[5],
        borderBottom: 1,
        borderLeft: 2,
        borderRight: 0,
        borderStyle: "solid",
        userSelect: 'none',
        listStyle: 'none',
        zIndex: 2000,
        cursor: 'pointer',
        position: 'relative',
        padding: theme.scale[1],
        borderColor: color(theme.colors.gray).lighten(0.1).hexString(),
        backgroundColor: theme.colors.gray,
        ":hover": {
          backgroundColor: color(theme.colors.gray).lighten(0.15).hexString(),
        }
    }}>
      <DragHandle />
      <span>#{this.props.layerId}</span>
    </li>
  }
}

export default Radium(LayerListItem);
