import React from 'react';
import FileReaderInput from 'react-file-reader-input';

import Button from 'rebass/dist/Button'
import Text from 'rebass/dist/Text'
import Menu from 'rebass/dist/Menu'
import NavItem from 'rebass/dist/NavItem'
import Tooltip from 'rebass/dist/Tooltip'
import Container from 'rebass/dist/Container'
import Block from 'rebass/dist/Block'
import Fixed from 'rebass/dist/Fixed'

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

import style from './style.js'
import { fullHeight } from './theme.js'
import theme from './theme.js';

const InlineBlock = props => <div style={{display: "inline-block", ...props.style}}>
  {props.children}
</div>

export class Toolbar extends React.Component {
  static propTypes = {
    // A new style has been uploaded
    onStyleUpload: React.PropTypes.func.isRequired,
    // Current style is requested for download
    onStyleDownload: React.PropTypes.func.isRequired,
    // Style is explicitely saved to local cache
    onStyleSave: React.PropTypes.func,
    // Open settings drawer
    onOpenSettings: React.PropTypes.func,
    // Open about page
    onOpenAbout: React.PropTypes.func,
    // Open sources drawer
    onOpenSources: React.PropTypes.func,
    // Whether a style is available for download or saving
    // A style with no layers should not be available
    styleAvailable: React.PropTypes.bool,
  }

  onUpload(_, files) {
    const [e, file] = files[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
      let mapStyle = style.fromJSON(JSON.parse(e.target.result))
      mapStyle = style.ensureMetadataExists(mapStyle)
      this.props.onStyleUpload(mapStyle);
    }
    reader.onerror = e => console.log(e.target);
  }

  saveButton() {
    if(this.props.styleAvailable) {
      return <InlineBlock>
        <Button onClick={this.props.onStyleSave} big={true}>
          <MdSave />
          Save
        </Button>
      </InlineBlock>
    }
    return null
  }

  downloadButton() {
    if(this.props.styleAvailable) {
      return <InlineBlock>
        <Button onClick={this.props.onStyleDownload} big={true}>
          <MdFileDownload />
          Download
        </Button>
      </InlineBlock>
    }
    return null
  }

  render() {

    return <div style={{
      position: "fixed",
      height: 50,
      width: '100%',
      zIndex: 100,
      left: 0,
      top: 0,
      backgroundColor: theme.colors.black
    }}>
      <InlineBlock>
          <Button style={{width: 300, textAlign: 'left'}}>
            <img src="https://github.com/maputnik/editor/raw/master/media/maputnik.png" alt="Maputnik" style={{width: 40, height: 40, paddingRight: 5, verticalAlign: 'middle'}}/>
            <span style={{fontSize: 20 }}>Maputnik</span>
          </Button>
      </InlineBlock>
      <InlineBlock>
        <FileReaderInput onChange={this.onUpload.bind(this)}>
          <Button big={true} theme={this.props.styleAvailable ? "default" : "success"}>
            <MdOpenInBrowser />
            Open
          </Button>
        </FileReaderInput>
      </InlineBlock>
      {this.downloadButton()}
      {this.saveButton()}
      <InlineBlock>
        <Button big={true} onClick={this.props.onOpenSettings}>
          <MdLayers />
          Tilesets
        </Button>
      </InlineBlock>
      <InlineBlock>
        <Button big={true} onClick={this.props.onOpenSettings}>
          <MdFontDownload />
          Fonts
        </Button>
      </InlineBlock>
      <InlineBlock>
        <Button big={true} onClick={this.props.onOpenSettings}>
          <MdInsertEmoticon/>
          Icons
        </Button>
      </InlineBlock>
      <InlineBlock>
        <Button big={true} onClick={this.props.onOpenSettings}>
          <MdFindInPage />
          Inspect
        </Button>
      </InlineBlock>
      <InlineBlock>
        <Button big={true} onClick={this.props.onOpenAbout}>
          <MdHelpOutline />
          Help
        </Button>
      </InlineBlock>
    </div>
  }
}
