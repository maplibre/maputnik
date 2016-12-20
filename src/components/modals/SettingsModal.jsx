import React from 'react'
import Immutable from 'immutable'

import Select from 'rebass/dist/Select'
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

class SettingsModal extends React.Component {
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

  onRendererChange(e) {
    const changedStyle = this.props.mapStyle.setIn(['metadata', 'maputnik:renderer'], e.target.value)
    this.props.onStyleChanged(changedStyle)
  }

  render() {
    return <Overlay open={this.props.open} >
      <Panel theme={'secondary'}>
        <PanelHeader theme={'default'}>
          Style Settings
          <Space auto />
          <Close onClick={this.props.toggle('modalOpen')} />
        </PanelHeader>
        <br />
        <Input
          name="name"
          label="Name"
          value={this.props.mapStyle.get('name')}
          onChange={this.onChange.bind(this, "name")}
        />
        <Input
          name="owner"
          label="Owner"
          value={this.props.mapStyle.get('owner')}
          onChange={this.onChange.bind(this, "owner")}
        />
        <Input
          name="sprite"
          label="Sprite URL"
          value={this.props.mapStyle.get('sprite')}
          onChange={this.onChange.bind(this, "sprite")}
        />
        <Input
          name="glyphs"
          label="Glyphs URL"
          value={this.props.mapStyle.get('glyphs')}
          onChange={this.onChange.bind(this, "glyphs")}
        />
        <Input
          name="glyphs"
          label="Glyphs URL"
          value={this.props.mapStyle.get('glyphs')}
          onChange={this.onChange.bind(this, "glyphs")}
        />
        <Select
          label="Style Renderer"
          name="renderer"
          onChange={this.onRendererChange.bind(this)}
          options={[{children: 'Mapbox GL JS', value: 'mbgljs'}, {children: 'Open Layers 3', value: 'ol3'}]}
        />

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

export default SettingsModal
