import React from "react";
import { ScrollContainer } from "./ScrollContainer";
import { type WithTranslation, withTranslation } from "react-i18next";
import { IconContext } from "react-icons";

type AppLayoutInternalProps = {
  toolbar: React.ReactElement
  layerList: React.ReactElement
  layerEditor?: React.ReactElement
  codeEditor?: React.ReactElement
  map: React.ReactElement
  bottom?: React.ReactElement
  modals?: React.ReactNode
} & WithTranslation;

type AppLayoutInternalState = {
  sidebarWidth: number
  isResizing: boolean
};

class AppLayoutInternal extends React.Component<AppLayoutInternalProps, AppLayoutInternalState> {
  constructor(props: AppLayoutInternalProps) {
    super(props);
    this.state = {
      sidebarWidth: 350,
      isResizing: false
    };
  }

  componentWillUnmount() {
    this.stopResizing();
  }

  startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    this.setState({ isResizing: true });
    document.addEventListener("mousemove", this.resizeSidebar);
    document.addEventListener("mouseup", this.stopResizing);
  };

  stopResizing = () => {
    this.setState({ isResizing: false });
    document.removeEventListener("mousemove", this.resizeSidebar);
    document.removeEventListener("mouseup", this.stopResizing);
  };

  resizeSidebar = (e: MouseEvent) => {
    const newWidth = Math.max(200, Math.min(e.clientX, window.innerWidth - 100));
    this.setState({ sidebarWidth: newWidth });
  };

  render() {
    document.body.dir = this.props.i18n.dir();

    const hasDrawer = !!this.props.layerEditor;
    const hasCodeEditor = !!this.props.codeEditor;
    const showResizer = hasDrawer || hasCodeEditor;
    const currentSidebarWidth = showResizer ? this.state.sidebarWidth : 200;

    const layoutClassName = [
      "maputnik-layout",
      hasDrawer ? "maputnik-layout--has-drawer" : "",
      hasCodeEditor ? "maputnik-layout--has-code-editor" : "",
      this.state.isResizing ? "maputnik-layout--is-resizing" : ""
    ].filter(Boolean).join(" ");

    return <IconContext.Provider value={{size: "14px"}}>
      <div className={layoutClassName}>
        {this.props.toolbar}
        <div className="maputnik-layout-main">
          <div className="maputnik-layout-sidebar" style={{ width: currentSidebarWidth }}>
            {this.props.codeEditor && <div className="maputnik-layout-code-editor">
              <ScrollContainer>
                {this.props.codeEditor}
              </ScrollContainer>
            </div>
            }
            {!this.props.codeEditor && <>
              <div className="maputnik-layout-list">
                {this.props.layerList}
              </div>
              {this.props.layerEditor && <div className="maputnik-layout-drawer">
                <ScrollContainer>
                  {this.props.layerEditor}
                </ScrollContainer>
              </div>
              }
            </>}
          </div>
          {showResizer && <div className="maputnik-layout-resizer" onMouseDown={this.startResizing} />}
          {this.props.map}
        </div>
        {this.props.bottom && <div className="maputnik-layout-bottom" style={{ left: currentSidebarWidth }}>
          {this.props.bottom}
        </div>
        }
        {this.props.modals}
      </div>
    </IconContext.Provider>;
  }
}

export const AppLayout = withTranslation()(AppLayoutInternal);
