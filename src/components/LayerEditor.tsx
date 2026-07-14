import React, { type JSX, useState } from "react";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import { Accordion } from "react-accessible-accordion";
import { MdMoreVert } from "react-icons/md";
import { IconContext } from "react-icons";
import { type BackgroundLayerSpecification, type LayerSpecification, type SourceSpecification } from "maplibre-gl";
import { v8 } from "@maplibre/maplibre-gl-style-spec";

import { FieldJson } from "./FieldJson";
import { FilterEditor } from "./FilterEditor";
import { PropertyGroup } from "./PropertyGroup";
import { LayerEditorGroup } from "./LayerEditorGroup";
import { FieldType } from "./FieldType";
import { FieldId } from "./FieldId";
import { FieldMinZoom } from "./FieldMinZoom";
import { FieldMaxZoom } from "./FieldMaxZoom";
import { FieldComment } from "./FieldComment";
import { FieldSource } from "./FieldSource";
import { FieldSourceLayer } from "./FieldSourceLayer";
// Aliased: the component defines its own changeProperty, which would otherwise
// shadow this import (as a class method there was no collision).
import { changeType, changeProperty as changeLayerProperty } from "../libs/layer";
import { formatLayerId } from "../libs/format";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { NON_SOURCE_LAYERS } from "../libs/non-source-layers";
import { type MappedError, type MappedLayerErrors, type OnMoveLayerCallback } from "../libs/definitions";

type MaputnikLayoutGroup = {
  id: string;
  title: string;
  type: string;
  fields: string[];
};

function getLayoutForSymbolType(t: TFunction): MaputnikLayoutGroup[] {
  const groups: MaputnikLayoutGroup[] = [];
  groups.push({
    title: t("General layout properties"),
    id: "General_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter(f => f.startsWith("symbol-"))
  });
  groups.push({
    title: t("Text layout properties"),
    id: "Text_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter(f => f.startsWith("text-"))
  });
  groups.push({
    title: t("Icon layout properties"),
    id: "Icon_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter(f => f.startsWith("icon-"))
  });
  groups.push({
    title: t("Text paint properties"),
    id: "Text_paint_properties",
    type: "properties",
    fields: Object.keys(v8["paint_symbol"]).filter(f => f.startsWith("text-"))
  });
  groups.push({
    title: t("Icon paint properties"),
    id: "Icon_paint_properties",
    type: "properties",
    fields: Object.keys(v8["paint_symbol"]).filter(f => f.startsWith("icon-"))
  });
  return groups;
}

function getLayoutForType(type: LayerSpecification["type"], t: TFunction): MaputnikLayoutGroup[] {
  if (Object.keys(v8.layer.type.values).indexOf(type) < 0) {
    return [];
  }
  if (type === "symbol") {
    return getLayoutForSymbolType(t);
  }
  const groups: MaputnikLayoutGroup[] = [];
  if (Object.keys(v8["paint_" + type]).length > 0) {
    groups.push({
      title: t("Paint properties"),
      id: "Paint_properties",
      type: "properties",
      fields: Object.keys(v8["paint_" + type]),
    });
  }
  if (Object.keys(v8["layout_" + type]).length > 0) {
    groups.push({
      title: t("Layout properties"),
      id: "Layout_properties",
      type: "properties",
      fields: Object.keys(v8["layout_" + type])
    });
  }
  return groups;
}

function layoutGroups(layerType: LayerSpecification["type"], t: TFunction): { id: string, title: string, type: string, fields?: string[] }[] {
  const layerGroup = {
    id: "layer",
    title: t("Layer"),
    type: "layer"
  };
  const filterGroup = {
    id: "filter",
    title: t("Filter"),
    type: "filter"
  };
  const editorGroup = {
    id: "jsoneditor",
    title: t("JSON Editor"),
    type: "jsoneditor"
  };
  return [layerGroup, filterGroup]
    .concat(getLayoutForType(layerType, t))
    .concat([editorGroup]);
}

type LayerEditorInternalProps = {
  layer: LayerSpecification
  sources: { [key: string]: SourceSpecification & { layers: string[] } }
  vectorLayers: { [key: string]: any }
  spec: any
  onLayerChanged(index: number, layer: LayerSpecification): void
  onLayerIdChange(...args: unknown[]): unknown
  onMoveLayer: OnMoveLayerCallback
  onLayerDestroy(...args: unknown[]): unknown
  onLayerCopy(...args: unknown[]): unknown
  onLayerVisibilityToggle(...args: unknown[]): unknown
  isFirstLayer?: boolean
  isLastLayer?: boolean
  layerIndex: number
  errors?: MappedError[]
} & WithTranslation;

/** Layer editor supporting multiple types of layers. */
const LayerEditorInternal: React.FC<LayerEditorInternalProps> = ({
  onLayerChanged = () => { },
  onLayerIdChange = () => { },
  ...rest
}) => {
  const props = { onLayerChanged, onLayerIdChange, ...rest } as LayerEditorInternalProps;

  const [editorGroups, setEditorGroups] = useState<{ [keys: string]: boolean }>(() => {
    const groups: { [keys: string]: boolean } = {};
    for (const group of layoutGroups(props.layer.type, props.t)) {
      groups[group.title] = true;
    }
    return groups;
  });

  // Replaces getDerivedStateFromProps: groups that appear after mount (because
  // the layer type changed) start out expanded. Guarded so it only sets state
  // when a group is genuinely new, otherwise this would loop every render.
  const newGroups = getLayoutForType(props.layer.type, props.t)
    .filter(group => !(group.title in editorGroups));
  if (newGroups.length > 0) {
    const additionalGroups = { ...editorGroups };
    for (const group of newGroups) {
      additionalGroups[group.title] = true;
    }
    setEditorGroups(additionalGroups);
  }

  function changeProperty(group: keyof LayerSpecification | null, property: string, newValue: any) {
    props.onLayerChanged(
      props.layerIndex,
      changeLayerProperty(props.layer, group, property, newValue)
    );
  }

  function onGroupToggle(groupTitle: string, active: boolean) {
    const changedActiveGroups = {
      ...editorGroups,
      [groupTitle]: active,
    };
    setEditorGroups(changedActiveGroups);
  }

  function renderGroupType(type: string, fields?: string[]): JSX.Element {
    let comment = "";
    if (props.layer.metadata) {
      comment = (props.layer.metadata as any)["maputnik:comment"];
    }
    const { errors, layerIndex } = props;

    const errorData: MappedLayerErrors = {};
    errors!.forEach(error => {
      if (
        error.parsed &&
        error.parsed.type === "layer" &&
        error.parsed.data.index == layerIndex
      ) {
        errorData[error.parsed.data.key] = {
          message: error.parsed.data.message
        };
      }
    });

    let sourceLayerIds;
    const layer = props.layer as Exclude<LayerSpecification, BackgroundLayerSpecification>;
    if (Object.prototype.hasOwnProperty.call(props.sources, layer.source)) {
      sourceLayerIds = props.sources[layer.source].layers;
    }

    switch (type) {
      case "layer": return <div>
        <FieldId
          value={props.layer.id}
          wdKey="layer-editor.layer-id"
          error={errorData.id}
          onChange={newId => props.onLayerIdChange(props.layerIndex, props.layer.id, newId)}
        />
        <FieldType
          disabled={true}
          error={errorData.type}
          value={props.layer.type}
          onChange={newType => props.onLayerChanged(
            props.layerIndex,
            changeType(props.layer, newType)
          )}
        />
        {props.layer.type !== "background" && <FieldSource
          wdKey="layer-editor.layer-source"
          error={errorData.source}
          sourceIds={Object.keys(props.sources!)}
          value={props.layer.source}
          onChange={v => changeProperty(null, "source", v)}
        />
        }
        {!NON_SOURCE_LAYERS.includes(props.layer.type) &&
          <FieldSourceLayer
            error={errorData["source-layer"]}
            sourceLayerIds={sourceLayerIds}
            value={(props.layer as any)["source-layer"]}
            onChange={v => changeProperty(null, "source-layer", v)}
          />
        }
        <FieldMinZoom
          error={errorData.minzoom}
          value={props.layer.minzoom}
          onChange={v => changeProperty(null, "minzoom", v)}
        />
        <FieldMaxZoom
          error={errorData.maxzoom}
          value={props.layer.maxzoom}
          onChange={v => changeProperty(null, "maxzoom", v)}
        />
        <FieldComment
          error={errorData.comment}
          value={comment}
          onChange={v => changeProperty("metadata", "maputnik:comment", v == "" ? undefined : v)}
        />
      </div>;
      case "filter": return <div>
        <div className="maputnik-filter-editor-wrapper">
          <FilterEditor
            errors={errorData}
            filter={(props.layer as any).filter}
            properties={props.vectorLayers[(props.layer as any)["source-layer"]]}
            onChange={f => changeProperty(null, "filter", f)}
          />
        </div>
      </div>;
      case "properties":
        return <PropertyGroup
          errors={errorData}
          layer={props.layer}
          groupFields={fields!}
          spec={props.spec}
          onChange={changeProperty.bind(null)}
        />;
      case "jsoneditor":
        return <FieldJson
          lintType="layer"
          value={props.layer}
          onChange={(layer: LayerSpecification) => {
            props.onLayerChanged(
              props.layerIndex,
              layer
            );
          }}
        />;
      default: return <></>;
    }
  }

  function moveLayer(offset: number) {
    props.onMoveLayer({
      oldIndex: props.layerIndex,
      newIndex: props.layerIndex + offset
    });
  }

  const t = props.t;

  const groupIds: string[] = [];
  const layerType = props.layer.type;
  const groups = layoutGroups(layerType, t).filter(group => {
    return !(layerType === "background" && group.type === "source");
  }).map(group => {
    const groupId = group.id;
    groupIds.push(groupId);
    return <LayerEditorGroup
      data-wd-key={group.title}
      id={groupId}
      key={groupId}
      title={group.title}
      isActive={editorGroups[group.title]}
      onActiveToggle={onGroupToggle.bind(null, group.title)}
    >
      {renderGroupType(group.type, group.fields)}
    </LayerEditorGroup>;
  });

  const layout = props.layer.layout || {};

  const items: {
    [key: string]: {
      text: string,
      handler: () => void,
      disabled?: boolean,
      wdKey?: string
    }
  } = {
    delete: {
      text: t("Delete"),
      handler: () => props.onLayerDestroy(props.layerIndex),
      wdKey: "menu-delete-layer"
    },
    duplicate: {
      text: t("Duplicate"),
      handler: () => props.onLayerCopy(props.layerIndex),
      wdKey: "menu-duplicate-layer"
    },
    hide: {
      text: (layout.visibility === "none") ? t("Show") : t("Hide"),
      handler: () => props.onLayerVisibilityToggle(props.layerIndex),
      wdKey: "menu-hide-layer"
    },
    moveLayerUp: {
      text: t("Move layer up"),
      disabled: props.isFirstLayer,
      handler: () => moveLayer(-1),
      wdKey: "menu-move-layer-up"
    },
    moveLayerDown: {
      text: t("Move layer down"),
      disabled: props.isLastLayer,
      handler: () => moveLayer(+1),
      wdKey: "menu-move-layer-down"
    }
  };

  function handleSelection(id: string, event: React.SyntheticEvent) {
    event.stopPropagation();
    items[id].handler();
  }

  return <IconContext.Provider value={{ size: "14px", color: "#8e8e8e" }}>
    <section className="maputnik-layer-editor"
      role="main"
      aria-label={t("Layer editor")}
      data-wd-key="layer-editor"
    >
      <header data-wd-key="layer-editor.header">
        <div className="layer-header">
          <h2 className="layer-header__title">
            {t("Layer")}: {formatLayerId(props.layer.id)}
          </h2>
          <div className="layer-header__info">
            <Wrapper
              className='more-menu'
              onSelection={(id, event) => handleSelection(id as string, event)}
              closeOnSelection={false}
            >
              <Button
                id="skip-target-layer-editor"
                data-wd-key="skip-target-layer-editor"
                className='more-menu__button'
                title={"Layer options"}>
                <MdMoreVert className="more-menu__button__svg" />
              </Button>
              <Menu>
                <ul className="more-menu__menu">
                  {Object.keys(items).map((id) => {
                    const item = items[id];
                    return <li key={id}>
                      <MenuItem value={id} className='more-menu__menu__item' data-wd-key={item.wdKey}>
                        {item.text}
                      </MenuItem>
                    </li>;
                  })}
                </ul>
              </Menu>
            </Wrapper>
          </div>
        </div>

      </header>
      <Accordion
        allowMultipleExpanded={true}
        allowZeroExpanded={true}
        preExpanded={groupIds}
      >
        {groups}
      </Accordion>
    </section>
  </IconContext.Provider>;
};

export const LayerEditor = withTranslation()(LayerEditorInternal);
