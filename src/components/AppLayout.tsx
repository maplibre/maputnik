import React, { useEffect, useState } from "react";
import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels";
import { ScrollContainer } from "./ScrollContainer";
import { useTranslation } from "react-i18next";
import { IconContext } from "react-icons";

// Keep these in sync with $layout-list-width/$layout-editor-width in _vars.scss
const DEFAULT_LIST_WIDTH = 200;
const DEFAULT_DRAWER_WIDTH = 370;
const DEFAULT_SIDEBAR_WIDTH = DEFAULT_LIST_WIDTH + DEFAULT_DRAWER_WIDTH;

const SIDEBAR_LAYOUT_ID = "maputnik:sidebar-layout";
const SIDEBAR_INNER_LAYOUT_ID = "maputnik:sidebar-inner-layout";
const SIDEBAR_PANEL_ID = "sidebar";
const MAP_PANEL_ID = "map";
const LIST_PANEL_ID = "list";
const DRAWER_PANEL_ID = "drawer";

type AppLayoutProps = {
  toolbar: React.ReactElement
  layerList: React.ReactElement
  layerEditor?: React.ReactElement
  codeEditor?: React.ReactElement
  map: React.ReactElement
  bottom?: React.ReactElement
  modals?: React.ReactNode
};

export const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const { t, i18n } = useTranslation();

  const sidebarLayout = useDefaultLayout({
    id: SIDEBAR_LAYOUT_ID,
    panelIds: [SIDEBAR_PANEL_ID, MAP_PANEL_ID],
  });
  const innerLayout = useDefaultLayout({
    id: SIDEBAR_INNER_LAYOUT_ID,
    panelIds: [LIST_PANEL_ID, DRAWER_PANEL_ID],
  });

  // The bottom panel is position: fixed, so it can't be a flex sibling of the
  // map panel; it follows the sidebar through this custom property instead.
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return <IconContext.Provider value={{size: "14px"}}>
    <div
      className="maputnik-layout"
      style={{"--sidebar-width": `${sidebarWidth}px`} as React.CSSProperties}
    >
      {props.toolbar}
      <div className="maputnik-layout-main">
        <Group
          className="maputnik-layout-panels"
          orientation="horizontal"
          id={SIDEBAR_LAYOUT_ID}
          defaultLayout={sidebarLayout.defaultLayout}
          onLayoutChanged={sidebarLayout.onLayoutChanged}
        >
          <Panel
            id={SIDEBAR_PANEL_ID}
            data-wd-key="sidebar-panel"
            className={props.codeEditor ? "maputnik-layout-code-editor" : "maputnik-layout-sidebar"}
            defaultSize={`${DEFAULT_SIDEBAR_WIDTH}px`}
            minSize="280px"
            onResize={({inPixels}) => setSidebarWidth(inPixels)}
          >
            {props.codeEditor && <ScrollContainer>
              {props.codeEditor}
            </ScrollContainer>
            }
            {!props.codeEditor && <Group
              className="maputnik-layout-sidebar-panels"
              orientation="horizontal"
              id={SIDEBAR_INNER_LAYOUT_ID}
              defaultLayout={innerLayout.defaultLayout}
              onLayoutChanged={innerLayout.onLayoutChanged}
            >
              <Panel
                id={LIST_PANEL_ID}
                data-wd-key="layer-list-panel"
                className="maputnik-layout-list"
                defaultSize={`${DEFAULT_LIST_WIDTH}px`}
                minSize="100px"
              >
                {props.layerList}
              </Panel>
              <Separator
                className="maputnik-layout-resize-handle"
                data-wd-key="inner-resize-handle"
                title={t("Drag to resize the layer list")}
                aria-label={t("Drag to resize the layer list")}
              />
              <Panel
                id={DRAWER_PANEL_ID}
                className="maputnik-layout-drawer"
                defaultSize={`${DEFAULT_DRAWER_WIDTH}px`}
                minSize="150px"
              >
                <ScrollContainer>
                  {props.layerEditor}
                </ScrollContainer>
              </Panel>
            </Group>
            }
          </Panel>
          <Separator
            className="maputnik-layout-resize-handle"
            data-wd-key="sidebar-resize-handle"
            title={t("Drag to resize the sidebar")}
            aria-label={t("Drag to resize the sidebar")}
          />
          <Panel id={MAP_PANEL_ID} className="maputnik-layout-map" minSize="200px">
            {props.map}
          </Panel>
        </Group>
      </div>
      {props.bottom && <div className="maputnik-layout-bottom">
        {props.bottom}
      </div>
      }
      {props.modals}
    </div>
  </IconContext.Provider>;
};
