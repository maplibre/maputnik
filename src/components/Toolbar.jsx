import React from 'react'
import FileReaderInput from 'react-file-reader-input'

import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'
import MdOpenInBrowser from 'react-icons/lib/md/open-in-browser'
import MdSettings from 'react-icons/lib/md/settings'
import MdInfo from 'react-icons/lib/md/info'
import MdLayers from 'react-icons/lib/md/layers'
import MdSave from 'react-icons/lib/md/save'
import MdStyle from 'react-icons/lib/md/style'
import MdMap from 'react-icons/lib/md/map'
import MdInsertEmoticon from 'react-icons/lib/md/insert-emoticon'
import MdFontDownload from 'react-icons/lib/md/font-download'
import MdHelpOutline from 'react-icons/lib/md/help-outline'
import MdFindInPage from 'react-icons/lib/md/find-in-page'

import SettingsModal from './modals/SettingsModal'
import SourcesModal from './modals/SourcesModal'
import OpenModal from './modals/OpenModal'

import style from '../libs/style'
import colors from '../config/colors'
import { margins, fontSizes } from '../config/scales'

const IconText = props => <span style={{ paddingLeft: margins[0] }}>
  {props.children}
</span>

const ToolbarAction = props => <a onClick={props.onClick}
  style={{
    display: "inline-block",
    padding: margins[1],
    fontSize: fontSizes[4],
    cursor: "pointer",
    ...props.style,
  }}>
  {props.children}
</a>


export default class Toolbar extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    // A new style has been uploaded
    onStyleUpload: React.PropTypes.func.isRequired,
    // Current style is requested for download
    onStyleDownload: React.PropTypes.func.isRequired,
    // Style is explicitely saved to local cache
    onStyleSave: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      openSettingsModal: false,
      openSourcesModal: false,
      openOpenModal: false,
    }
  }

  saveButton() {
    if(this.props.mapStyle.layers.length > 0) {
      return <ToolbarAction onClick={this.props.onStyleSave} big={true}>
        <MdSave />
        <IconText>Save</IconText>
      </ToolbarAction>
    }
    return null
  }

  downloadButton() {
    return <ToolbarAction onClick={this.props.onStyleDownload} big={true}>
      <MdFileDownload />
      <IconText>Download</IconText>
    </ToolbarAction>
  }

  toggleSettings() {
    this.setState({openSettingsModal: !this.state.openSettingsModal})
  }

  toggleSources() {
    this.setState({openSourcesModal: !this.state.openSourcesModal})
  }

  toggleOpen() {
    this.setState({openOpenModal: !this.state.openOpenModal})
  }

  render() {
    return <div style={{
      position: "fixed",
      height: 40,
      width: '100%',
      zIndex: 100,
      left: 0,
      top: 0,
      backgroundColor: colors.black
    }}>
      <SettingsModal
        mapStyle={this.props.mapStyle}
        onStyleChanged={this.props.onStyleChanged}
        isOpen={this.state.openSettingsModal}
        toggle={() => this.toggleSettings.bind(this)}
      />
      <OpenModal
        isOpen={this.state.openOpenModal}
        toggle={() => this.toggleOpen.bind(this)}
      />
      <SourcesModal
        mapStyle={this.props.mapStyle}
        onStyleChanged={this.props.onStyleChanged}
        isOpen={this.state.openSourcesModal}
        toggle={() => this.toggleSources.bind(this)}
      />
      <ToolbarAction style={{
        width: 180,
        textAlign: 'left',
        backgroundColor: colors.black
      }}>
        <img src="https://github.com/maputnik/editor/raw/master/media/maputnik.png" alt="Maputnik" style={{width: 30, height: 30, paddingRight: 5, verticalAlign: 'middle'}}/>
        <span style={{fontSize: 20, verticalAlign: 'middle' }}>Maputnik</span>
      </ToolbarAction>
      <ToolbarAction onClick={this.toggleOpen.bind(this)}>
        <MdOpenInBrowser />
        <IconText>Open</IconText>
      </ToolbarAction>
      {this.downloadButton()}
      {this.saveButton()}
      <ToolbarAction onClick={this.toggleSources.bind(this)}>
        <MdLayers />
        <IconText>Sources</IconText>
      </ToolbarAction>
      <ToolbarAction onClick={this.toggleSettings.bind(this)}>
        <MdSettings />
        <IconText>Style Settings</IconText>
      </ToolbarAction>
      <ToolbarAction onClick={this.toggleSettings.bind(this)}>
        <MdFindInPage />
        <IconText>Inspect</IconText>
      </ToolbarAction>
      <ToolbarAction onClick={this.props.onOpenAbout}>
        <MdHelpOutline />
        <IconText>Help</IconText>
      </ToolbarAction>
    </div>
  }
}
