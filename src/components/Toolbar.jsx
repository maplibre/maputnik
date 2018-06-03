import React from 'react'
import PropTypes from 'prop-types'
import FileReaderInput from 'react-file-reader-input'
import classnames from 'classnames'

import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'
import OpenIcon from 'react-icons/lib/md/open-in-browser'
import SettingsIcon from 'react-icons/lib/md/settings'
import MdInfo from 'react-icons/lib/md/info'
import SourcesIcon from 'react-icons/lib/md/layers'
import MdSave from 'react-icons/lib/md/save'
import MdStyle from 'react-icons/lib/md/style'
import MdMap from 'react-icons/lib/md/map'
import MdInsertEmoticon from 'react-icons/lib/md/insert-emoticon'
import MdFontDownload from 'react-icons/lib/md/font-download'
import HelpIcon from 'react-icons/lib/md/help-outline'
import InspectionIcon from 'react-icons/lib/md/find-in-page'

import logoImage from 'maputnik-design/logos/logo-color.svg'
import pkgJson from '../../package.json'

import style from '../libs/style'

class IconText extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return <span className="maputnik-icon-text">{this.props.children}</span>
  }
}

class ToolbarLink extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    href: PropTypes.string,
    onToggleModal: PropTypes.func,
  }

  render() {
    return <a
      className={classnames('maputnik-toolbar-link', this.props.className)}
      href={this.props.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {this.props.children}
    </a>
  }
}

class ToolbarAction extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    wdKey: PropTypes.string
  }

  render() {
    return <button
      className='maputnik-toolbar-action'
      data-wd-key={this.props.wdKey}
      onClick={this.props.onClick}
    >
      {this.props.children}
    </button>
  }
}

export default class Toolbar extends React.Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    inspectModeEnabled: PropTypes.bool.isRequired,
    onStyleChanged: PropTypes.func.isRequired,
    // A new style has been uploaded
    onStyleOpen: PropTypes.func.isRequired,
    // A dict of source id's and the available source layers
    sources: PropTypes.object.isRequired,
    onInspectModeToggle: PropTypes.func.isRequired,
    children: PropTypes.node,
    onToggleModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpen: {
        settings: false,
        sources: false,
        open: false,
        add: false,
        export: false,
      }
    }
  }

  render() {
    return <div className='maputnik-toolbar'>
      <div className="maputnik-toolbar__inner">
        <ToolbarLink
          tabIndex="2"
          href={"https://github.com/maputnik/editor"}
          className="maputnik-toolbar-logo"
        >
          <a tabIndex="1" className="maputnik-toolbar-skip" href="#skip-menu">
            Skip navigation
          </a>
          <img src={logoImage} alt="Maputnik" />
          <h1>Maputnik
            <span className="maputnik-toolbar-version">v{pkgJson.version}</span>
          </h1>
        </ToolbarLink>
        <div className="maputnik-toolbar__actions">
          <ToolbarAction wdKey="nav:open" onClick={this.props.onToggleModal.bind(this, 'open')}>
            <OpenIcon />
            <IconText>Open</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:export" onClick={this.props.onToggleModal.bind(this, 'export')}>
            <MdFileDownload />
            <IconText>Export</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:sources" onClick={this.props.onToggleModal.bind(this, 'sources')}>
            <SourcesIcon />
            <IconText>Data Sources</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:settings" onClick={this.props.onToggleModal.bind(this, 'settings')}>
            <SettingsIcon />
            <IconText>Style Settings</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:inspect" onClick={this.props.onInspectModeToggle}>
            <InspectionIcon />
            <IconText>
              { this.props.inspectModeEnabled && <span>Map Mode</span> }
              { !this.props.inspectModeEnabled && <span>Inspect Mode</span> }
            </IconText>
          </ToolbarAction>
          <ToolbarLink href={"https://github.com/maputnik/editor/wiki"}>
            <HelpIcon />
            <IconText>Help</IconText>
          </ToolbarLink>
        </div>
      </div>
    </div>
  }
}
