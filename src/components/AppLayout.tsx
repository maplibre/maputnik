import React, {useCallback, useEffect, useRef, useState} from "react";
import ScrollContainer from "./ScrollContainer";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";
import {
  DEFAULT_LIST_RATIO,
  DEFAULT_SIDEBAR_WIDTH,
  MIN_LIST_WIDTH,
  MIN_DRAWER_WIDTH,
  clampSidebarWidth,
  getSavedSidebarWidth,
  getSavedListRatio,
  saveSidebarWidth,
  saveListRatio,
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
  const {t, i18n} = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n]);

  const [sidebarWidth, setSidebarWidth] = useState<number>(
    () => getSavedSidebarWidth() ?? DEFAULT_SIDEBAR_WIDTH
  );
  const [listRatio, setListRatio] = useState<number>(
    () => getSavedListRatio() ?? DEFAULT_LIST_RATIO
  );

  // Outer handle (sidebar <-> map) drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Inner handle (list <-> drawer) drag state
  const isInnerDragging = useRef(false);
  const innerStartX = useRef(0);
  const innerStartListWidth = useRef(0);

  // Compute sub-widths from ratio
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

  // Inner handle: resize list <-> drawer split
  const handleInnerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isInnerDragging.current = true;
    innerStartX.current = e.clientX;
    innerStartListWidth.current = listWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [listWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isRtl = document.body.dir === "rtl";

      // Outer drag
      if (isDragging.current) {
        const delta = isRtl
          ? startX.current - e.clientX
          : e.clientX - startX.current;
        const newWidth = clampSidebarWidth(startWidth.current + delta);
        setSidebarWidth(newWidth);
      }

      // Inner drag
      if (isInnerDragging.current) {
        const delta = isRtl
          ? innerStartX.current - e.clientX
          : e.clientX - innerStartX.current;
        const newListWidth = innerStartListWidth.current + delta;
        setSidebarWidth((sw) => {
          const clampedList = Math.max(MIN_LIST_WIDTH, Math.min(sw - MIN_DRAWER_WIDTH, newListWidth));
          const newRatio = clampedList / sw;
          setListRatio(newRatio);
          return sw;
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setSidebarWidth((w) => {
          saveSidebarWidth(w);
          return w;
        });
      }
      if (isInnerDragging.current) {
        isInnerDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setListRatio((r) => {
          saveListRatio(r);
          return r;
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

  return <IconContext.Provider value={{size: "14px"}}>
    <div className="maputnik-layout" style={{
      "--sidebar-list-width": `${listWidth}px`,
      "--sidebar-drawer-width": `${drawerWidth}px`,
      "--sidebar-total-width": `${sidebarWidth}px`,
    } as React.CSSProperties}>
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
          <div
            className="maputnik-layout-resize-handle maputnik-layout-resize-handle--inner"
            data-wd-key="inner-resize-handle"
            onMouseDown={handleInnerMouseDown}
            title={t("Drag to resize list / editor split")}
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="maputnik-layout-drawer">
            <ScrollContainer>
              {props.layerEditor}
            </ScrollContainer>
          </div>
          <div
            className="maputnik-layout-resize-handle"
            data-wd-key="sidebar-resize-handle"
            onMouseDown={handleMouseDown}
            title={t("Drag to resize sidebar")}
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
