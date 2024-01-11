import React from 'react'
import classnames from 'classnames'
import {detect} from 'detect-browser';

import {MdFileDownload, MdOpenInBrowser, MdSettings, MdLayers, MdHelpOutline, MdFindInPage} from 'react-icons/md'
import pkgJson from '../../package.json'


// This is required because of <https://stackoverflow.com/a/49846426>, there isn't another way to detect support that I'm aware of.
const browser = detect();
const colorAccessibilityFiltersEnabled = ['chrome', 'firefox'].indexOf(browser!.name) > -1;


type IconTextProps = {
  children?: React.ReactNode
};


class IconText extends React.Component<IconTextProps> {
  render() {
    return <span className="maputnik-icon-text">{this.props.children}</span>
  }
}

type ToolbarLinkProps = {
  className?: string
  children?: React.ReactNode
  href?: string
  onToggleModal?(...args: unknown[]): unknown
};

class ToolbarLink extends React.Component<ToolbarLinkProps> {
  render() {
    return <a
      className={classnames('maputnik-toolbar-link', this.props.className)}
      href={this.props.href}
      rel="noopener noreferrer"
      target="_blank"
      data-wd-key="toolbar:link"
    >
      {this.props.children}
    </a>
  }
}

type ToolbarSelectProps = {
  children?: React.ReactNode
  wdKey?: string
};

class ToolbarSelect extends React.Component<ToolbarSelectProps> {
  render() {
    return <div
      className='maputnik-toolbar-select'
      data-wd-key={this.props.wdKey}
    >
      {this.props.children}
    </div>
  }
}

type ToolbarActionProps = {
  children?: React.ReactNode
  onClick?(...args: unknown[]): unknown
  wdKey?: string
};

class ToolbarAction extends React.Component<ToolbarActionProps> {
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

export type MapState = "map" | "inspect" | "filter-achromatopsia" | "filter-deuteranopia" | "filter-protanopia" | "filter-tritanopia";

type AppToolbarProps = {
  mapStyle: object
  inspectModeEnabled: boolean
  onStyleChanged(...args: unknown[]): unknown
  // A new style has been uploaded
  onStyleOpen(...args: unknown[]): unknown
  // A dict of source id's and the available source layers
  sources: object
  children?: React.ReactNode
  onToggleModal(...args: unknown[]): unknown
  onSetMapState(mapState: MapState): unknown
  mapState?: MapState
  renderer?: string
};

export default class AppToolbar extends React.Component<AppToolbarProps> {
  state = {
    isOpen: {
      settings: false,
      sources: false,
      open: false,
      add: false,
      export: false,
    }
  }

  handleSelection(val: MapState) {
    this.props.onSetMapState(val);
  }

  onSkip = (target: string) => {
    if (target === "map") {
      (document.querySelector(".maplibregl-canvas") as HTMLCanvasElement).focus();
    }
    else {
      const el = document.querySelector("#skip-target-"+target) as HTMLButtonElement;
      el.focus();
    }
  }

  render() {
    const views = [
      {
        id: "map",
        group: "general",
        title: "Map",
      },
      {
        id: "inspect",
        group: "general",
        title: "Inspect",
        disabled: this.props.renderer === 'ol',
      },
      {
        id: "filter-deuteranopia",
        group: "color-accessibility",
        title: "Deuteranopia filter",
        disabled: !colorAccessibilityFiltersEnabled,
      },
      {
        id: "filter-protanopia",
        group: "color-accessibility",
        title: "Protanopia filter",
        disabled: !colorAccessibilityFiltersEnabled,
      },
      {
        id: "filter-tritanopia",
        group: "color-accessibility",
        title: "Tritanopia filter",
        disabled: !colorAccessibilityFiltersEnabled,
      },
      {
        id: "filter-achromatopsia",
        group: "color-accessibility",
        title: "Achromatopsia filter",
        disabled: !colorAccessibilityFiltersEnabled,
      },
    ];

    const currentView = views.find((view) => {
      return view.id === this.props.mapState;
    });

    return <nav className='maputnik-toolbar'>
      <div className="maputnik-toolbar__inner">
        <div
          className="maputnik-toolbar-logo-container"
        >
          {/* Keyboard accessible quick links */}
          <button
            data-wd-key="root:skip:layer-list"
            className="maputnik-toolbar-skip"
            onClick={_e => this.onSkip("layer-list")}
          >
            Layers list
          </button>
          <button
            data-wd-key="root:skip:layer-editor"
            className="maputnik-toolbar-skip"
            onClick={_e => this.onSkip("layer-editor")}
          >
            Layer editor
          </button>
          <button
            data-wd-key="root:skip:map-view"
            className="maputnik-toolbar-skip"
            onClick={_e => this.onSkip("map")}
          >
            Map view
          </button>
          <a
            className="maputnik-toolbar-logo"
            target="blank"
            rel="noreferrer noopener"
            href="https://github.com/maplibre/maputnik"
          >
            <img src="node_modules/maputnik-design/logos/logo-color.svg" />
            <h1>
              <span className="maputnik-toolbar-name">{pkgJson.name}</span>
              <span className="maputnik-toolbar-version">v{pkgJson.version}</span>
            </h1>
          </a>
        </div>
        <div className="maputnik-toolbar__actions" role="navigation" aria-label="Toolbar">
          <ToolbarAction wdKey="nav:open" onClick={this.props.onToggleModal.bind(this, 'open')}>
            <MdOpenInBrowser />
            <IconText>Open</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:export" onClick={this.props.onToggleModal.bind(this, 'export')}>
            <MdFileDownload />
            <IconText>Export</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:sources" onClick={this.props.onToggleModal.bind(this, 'sources')}>
            <MdLayers />
            <IconText>Data Sources</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:settings" onClick={this.props.onToggleModal.bind(this, 'settings')}>
            <MdSettings />
            <IconText>Style Settings</IconText>
          </ToolbarAction>

          <ToolbarSelect wdKey="nav:inspect">
            <MdFindInPage />
            <label>View
              <select
                className="maputnik-select"
                data-wd-key="maputnik-select"
                onChange={(e) => this.handleSelection(e.target.value as MapState)}
                value={currentView?.id}
              >
                {views.filter(v => v.group === "general").map((item) => {
                  return (
                    <option key={item.id} value={item.id} disabled={item.disabled} data-wd-key={item.id}>
                      {item.title}
                    </option>
                  );
                })}
                <optgroup label="Color accessibility">
                  {views.filter(v => v.group === "color-accessibility").map((item) => {
                    return (
                      <option key={item.id} value={item.id} disabled={item.disabled}>
                        {item.title}
                      </option>
                    );
                  })}
                </optgroup>
              </select>
            </label>
          </ToolbarSelect>

          <ToolbarLink href={"https://github.com/maplibre/maputnik/wiki"}>
            <MdHelpOutline />
            <IconText>Help</IconText>
          </ToolbarLink>
        </div>
      </div>
    </nav>
  }
}
