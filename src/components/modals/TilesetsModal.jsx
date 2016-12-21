import React from 'react'

import Modal from './Modal'

import publicTilesets from '../../config/tilesets.json'
import colors from '../../config/colors'
import { margins } from '../../config/scales'

class TilesetsModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool.isRequired,
    toggle: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const tilesetOptions = publicTilesets.map(tileset => {
      return <div key={tileset.id} style={{
        padding: margins[0],
        borderBottom: 1,
      }}>
        #{tileset.id}
        <br />
        {tileset.url}
      </div>
    })

    return <Modal
      isOpen={this.props.open}
      toggleOpen={this.props.toggle}
      title={'Tilesets'}
    >
      <h2>Add New Tileset</h2>
      <h2>Choose Public Tileset</h2>
      {tilesetOptions}
    </Modal>
  }
}

export default TilesetsModal
