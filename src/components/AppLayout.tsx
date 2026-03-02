import React, {useCallback, useEffect, useRef, useState} from "react";
import ScrollContainer from "./ScrollContainer";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";
import {
  DEFAULT_LIST_WIDTH,
  DEFAULT_SIDEBAR_WIDTH,
  clampSidebarWidth,
  getSavedSidebarWidth,
  saveSidebarWidth,
} from "../libs/sidebar";

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
  const {i18n} = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n]);

  const [sidebarWidth, setSidebarWidth] = useState<number>(
    () => getSavedSidebarWidth() ?? DEFAULT_SIDEBAR_WIDTH
  );
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Compute proportional sub-widths so list and drawer scale together
  const listRatio = DEFAULT_LIST_WIDTH / DEFAULT_SIDEBAR_WIDTH;
  const listWidth = Math.round(sidebarWidth * listRatio);
  const drawerWidth = sidebarWidth - listWidth;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const isRtl = document.body.dir === "rtl";
      const delta = isRtl
        ? startX.current - e.clientX
        : e.clientX - startX.current;
      const newWidth = clampSidebarWidth(startWidth.current + delta);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        // Save on release
        setSidebarWidth((w) => {
          saveSidebarWidth(w);
          return w;
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const layoutStyle = {
    "--sidebar-list-width": `${listWidth}px`,
    "--sidebar-drawer-width": `${drawerWidth}px`,
    "--sidebar-total-width": `${sidebarWidth}px`,
  } as React.CSSProperties;

  return <IconContext.Provider value={{size: "14px"}}>
    <div className="maputnik-layout" style={layoutStyle}>
      {props.toolbar}
      <div className="maputnik-layout-main">
        {props.codeEditor && <div className="maputnik-layout-code-editor">
          <ScrollContainer>
            {props.codeEditor}
          </ScrollContainer>
        </div>
        }
        {!props.codeEditor && <>
          <div className="maputnik-layout-list">
            {props.layerList}
          </div>
          <div className="maputnik-layout-drawer">
            <ScrollContainer>
              {props.layerEditor}
            </ScrollContainer>
          </div>
          <div
            className="maputnik-layout-resize-handle"
            data-testid="sidebar-resize-handle"
            onMouseDown={handleMouseDown}
            title="Drag to resize sidebar"
            tabIndex={-1}
            aria-hidden="true"
          />
        </>}
        {props.map}
      </div>
      {props.bottom && <div className="maputnik-layout-bottom">
        {props.bottom}
      </div>
      }
      {props.modals}
    </div>
  </IconContext.Provider>;
}
