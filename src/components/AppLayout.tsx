import React, {useEffect, useState} from "react";
import {Group, Panel, Separator, useDefaultLayout} from "react-resizable-panels";
import ScrollContainer from "./ScrollContainer";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";

const DEFAULT_LIST_WIDTH = 200;
const DEFAULT_DRAWER_WIDTH = 370;
const DEFAULT_SIDEBAR_WIDTH = DEFAULT_LIST_WIDTH + DEFAULT_DRAWER_WIDTH;
const DEFAULT_LIST_RATIO = DEFAULT_LIST_WIDTH / DEFAULT_SIDEBAR_WIDTH;

const SIDEBAR_LAYOUT_STORAGE_ID = "maputnik:sidebar-layout";
const SIDEBAR_INNER_LAYOUT_STORAGE_ID = "maputnik:sidebar-inner-layout";
const SIDEBAR_PANEL_ID = "sidebar";
const MAP_PANEL_ID = "map";
const LIST_PANEL_ID = "list";
const DRAWER_PANEL_ID = "drawer";

const getDefaultSidebarPercent = () => {
  const viewportWidth = window.innerWidth || DEFAULT_SIDEBAR_WIDTH;
  return Math.min(100, (DEFAULT_SIDEBAR_WIDTH / viewportWidth) * 100);
};

const getDefaultListPercent = () => DEFAULT_LIST_RATIO * 100;

type AppLayoutProps = {
  toolbar: React.ReactElement
  layerList: React.ReactElement
  layerEditor?: React.ReactElement
  codeEditor?: React.ReactElement
  map: React.ReactElement
  bottom?: React.ReactElement
  modals?: React.ReactNode
};

export default function AppLayout(props: AppLayoutProps) {
  const {t, i18n} = useTranslation();

  const sidebarLayout = useDefaultLayout({
    id: SIDEBAR_LAYOUT_STORAGE_ID,
    panelIds: [SIDEBAR_PANEL_ID, MAP_PANEL_ID],
  });
  const sidebarInnerLayout = useDefaultLayout({
    id: SIDEBAR_INNER_LAYOUT_STORAGE_ID,
    panelIds: [LIST_PANEL_ID, DRAWER_PANEL_ID],
  });

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n]);

  const [sidebarSize, setSidebarSize] = useState<number>(
    () => sidebarLayout.defaultLayout?.[SIDEBAR_PANEL_ID] ?? getDefaultSidebarPercent()
  );
  const [listSize, setListSize] = useState<number>(
    () => sidebarInnerLayout.defaultLayout?.[LIST_PANEL_ID] ?? getDefaultListPercent()
  );

  return <IconContext.Provider value={{size: "14px"}}>
    <div className="maputnik-layout" style={{
      "--sidebar-list-width": `${listSize}%`,
      "--sidebar-drawer-width": `${100 - listSize}%`,
      "--sidebar-total-width": `${sidebarSize}%`,
    } as React.CSSProperties}>
      {props.toolbar}
      <div className="maputnik-layout-main">
        <Group
          className="maputnik-layout-panels"
          orientation="horizontal"
          id={SIDEBAR_LAYOUT_STORAGE_ID}
          defaultLayout={sidebarLayout.defaultLayout}
          onLayoutChanged={(layout) => {
            setSidebarSize(layout[SIDEBAR_PANEL_ID] ?? sidebarSize);
            sidebarLayout.onLayoutChanged(layout);
          }}
        >
          <Panel
            id={SIDEBAR_PANEL_ID}
            className={props.codeEditor ? "maputnik-layout-code-editor" : "maputnik-layout-sidebar"}
            defaultSize="570px"
            minSize="280px"
          >
            {props.codeEditor ? <ScrollContainer>
              {props.codeEditor}
            </ScrollContainer> : <Group
              className="maputnik-layout-sidebar-panels"
              orientation="horizontal"
              id={SIDEBAR_INNER_LAYOUT_STORAGE_ID}
              defaultLayout={sidebarInnerLayout.defaultLayout}
              onLayoutChanged={(layout) => {
                setListSize(layout[LIST_PANEL_ID] ?? listSize);
                sidebarInnerLayout.onLayoutChanged(layout);
              }}
            >
              <Panel
                id={LIST_PANEL_ID}
                className="maputnik-layout-list"
                defaultSize="200px"
                minSize="100px"
              >
                {props.layerList}
              </Panel>
              <Separator
                className="maputnik-layout-resize-handle maputnik-layout-resize-handle--inner"
                data-wd-key="inner-resize-handle"
                title={t("Drag to resize list / editor split")}
                aria-label={t("Drag to resize list / editor split")}
              />
              <Panel
                id={DRAWER_PANEL_ID}
                className="maputnik-layout-drawer"
                minSize="150px"
              >
                <ScrollContainer>
                  {props.layerEditor}
                </ScrollContainer>
              </Panel>
            </Group>}
          </Panel>
          <Separator
            className="maputnik-layout-resize-handle"
            data-wd-key="sidebar-resize-handle"
            title={t("Drag to resize sidebar")}
            aria-label={t("Drag to resize sidebar")}
          />
          <Panel
            id={MAP_PANEL_ID}
            className="maputnik-layout-map"
            minSize={0}
          >
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
}
