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

const AppLayoutInternal: React.FC<AppLayoutInternalProps> = (props) => {
  document.body.dir = props.i18n.dir();

  return <IconContext.Provider value={{size: "14px"}}>
    <div className="maputnik-layout">
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
};

export const AppLayout = withTranslation()(AppLayoutInternal);
