import React from 'react'
import Immutable from 'immutable'

import Overlay from 'rebass/dist/Overlay'
import Panel from 'rebass/dist/Panel'
import PanelHeader from 'rebass/dist/PanelHeader'
import PanelFooter from 'rebass/dist/PanelFooter'
import Button from 'rebass/dist/Button'
import Text from 'rebass/dist/Text'
import Media from 'rebass/dist/Media'
import Close from 'rebass/dist/Close'
import Space from 'rebass/dist/Space'
import Input from 'rebass/dist/Input'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'

import publicTilesets from '../tilesets.json'
import theme from '../theme.js'

class TilesetsModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    open: React.PropTypes.bool.isRequired,
    toggle: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  onChange(property, e) {
    const changedStyle = this.props.mapStyle.set(property, e.target.value)
    this.props.onStyleChanged(changedStyle)
  }

  render() {
    const tilesetOptions = publicTilesets.map(tileset => {
      return <div key={tileset.id} style={{
        padding: theme.scale[0],
        borderBottom: 1,
        borderTop: 1,
        borderLeft: 2,
        borderRight: 0,
        borderStyle: "solid",
        borderColor: theme.borderColor,
      }}>
        <Toolbar>
          <NavItem style={{fontWeight: 400}}>
            #{tileset.id}
          </NavItem>
          <Space auto x={1} />
        </Toolbar>
        {tileset.url}
      </div>
    })

    return <Overlay open={this.props.open} >
      <Panel theme={'secondary'}>
        <PanelHeader theme={'default'}>
          Tilesets
          <Space auto />
          <Close onClick={this.props.toggle('modalOpen')} />
        </PanelHeader>
        <br />

        <h2>Choose Public Tileset</h2>
        {tilesetOptions}

        <PanelFooter>
          <Space auto />
          <Button theme={'default'}
            onClick={this.props.toggle('modalOpen')}
            children='Close!'
          />
        </PanelFooter>
      </Panel>
    </Overlay>
  }
}

export default TilesetsModal
