import React from 'react'

import Space from 'rebass/dist/Space'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'

import Modal from './Modal'

import publicTilesets from '../../config/tilesets.json'
import theme from '../../config/rebass'
import colors from '../../config/colors'

class TilesetsModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool.isRequired,
    toggle: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
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

    return <Modal
      //isOpen={this.props.open}
      isOpen={true}
      toggleOpen={this.props.toggle}
      title={'Tilesets'}
    >
      <h2>Choose Public Tileset</h2>
      {tilesetOptions}
    </Modal>
  }
}

export default TilesetsModal
