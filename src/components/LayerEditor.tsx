import { v8 } from "@maplibre/maplibre-gl-style-spec";
import type { TFunction } from "i18next";
import type {
  BackgroundLayerSpecification,
  LayerSpecification,
  SourceSpecification,
} from "maplibre-gl";
import React, { type JSX } from "react";
import { Accordion } from "react-accessible-accordion";
import { Button, Menu, MenuItem, Wrapper } from "react-aria-menubutton";
import { type WithTranslation, withTranslation } from "react-i18next";
import { IconContext } from "react-icons";
import { MdMoreVert } from "react-icons/md";
import type { OnMoveLayerCallback } from "../libs/definitions";
import { formatLayerId } from "../libs/format";
import { changeProperty, changeType } from "../libs/layer";
import { NON_SOURCE_LAYERS } from "../libs/non-source-layers";
import FieldComment from "./FieldComment";
import FieldId from "./FieldId";
import FieldJson from "./FieldJson";
import FieldMaxZoom from "./FieldMaxZoom";
import FieldMinZoom from "./FieldMinZoom";
import FieldSource from "./FieldSource";
import FieldSourceLayer from "./FieldSourceLayer";
import FieldType from "./FieldType";
import FilterEditor from "./FilterEditor";
import LayerEditorGroup from "./LayerEditorGroup";
import PropertyGroup from "./PropertyGroup";

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
    fields: Object.keys(v8["layout_symbol"]).filter((f) =>
      f.startsWith("symbol-"),
    ),
  });
  groups.push({
    title: t("Text layout properties"),
    id: "Text_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter((f) =>
      f.startsWith("text-"),
    ),
  });
  groups.push({
    title: t("Icon layout properties"),
    id: "Icon_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter((f) =>
      f.startsWith("icon-"),
    ),
  });
  groups.push({
    title: t("Text paint properties"),
    id: "Text_paint_properties",
    type: "properties",
    fields: Object.keys(v8["paint_symbol"]).filter((f) =>
      f.startsWith("text-"),
    ),
  });
  groups.push({
    title: t("Icon paint properties"),
    id: "Icon_paint_properties",
    type: "properties",
    fields: Object.keys(v8["paint_symbol"]).filter((f) =>
      f.startsWith("icon-"),
    ),
  });
  return groups;
}

function getLayoutForType(
  type: LayerSpecification["type"],
  t: TFunction,
): MaputnikLayoutGroup[] {
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
      fields: Object.keys(v8["layout_" + type]),
    });
  }
  return groups;
}

function layoutGroups(
  layerType: LayerSpecification["type"],
  t: TFunction,
): { id: string; title: string; type: string; fields?: string[] }[] {
  const layerGroup = {
    id: "layer",
    title: t("Layer"),
    type: "layer",
  };
  const filterGroup = {
    id: "filter",
    title: t("Filter"),
    type: "filter",
  };
  const editorGroup = {
    id: "jsoneditor",
    title: t("JSON Editor"),
    type: "jsoneditor",
  };
  return [layerGroup, filterGroup]
    .concat(getLayoutForType(layerType, t))
    .concat([editorGroup]);
}

type LayerEditorInternalProps = {
  layer: LayerSpecification;
  sources: { [key: string]: SourceSpecification & { layers: string[] } };
  vectorLayers: { [key: string]: any };
  spec: any;
  onLayerChanged(...args: unknown[]): unknown;
  onLayerIdChange(...args: unknown[]): unknown;
  onMoveLayer: OnMoveLayerCallback;
  onLayerDestroy(...args: unknown[]): unknown;
  onLayerCopy(...args: unknown[]): unknown;
  onLayerVisibilityToggle(...args: unknown[]): unknown;
  isFirstLayer?: boolean;
  isLastLayer?: boolean;
  layerIndex: number;
  errors?: any[];
} & WithTranslation;

type LayerEditorState = {
  editorGroups: { [keys: string]: boolean };
};

/** Layer editor supporting multiple types of layers. */
class LayerEditorInternal extends React.Component<
  LayerEditorInternalProps,
  LayerEditorState
> {
  static defaultProps = {
    onLayerChanged: () => {},
    onLayerIdChange: () => {},
    onLayerDestroyed: () => {},
  };

  constructor(props: LayerEditorInternalProps) {
    super(props);

    const editorGroups: { [keys: string]: boolean } = {};
    for (const group of layoutGroups(this.props.layer.type, props.t)) {
      editorGroups[group.title] = true;
    }

    this.state = { editorGroups };
  }

  static getDerivedStateFromProps(
    props: Readonly<LayerEditorInternalProps>,
    state: LayerEditorState,
  ) {
    const additionalGroups = { ...state.editorGroups };

    for (const group of getLayoutForType(props.layer.type, props.t)) {
      if (!(group.title in additionalGroups)) {
        additionalGroups[group.title] = true;
      }
    }

    return {
      editorGroups: additionalGroups,
    };
  }

  changeProperty(
    group: keyof LayerSpecification | null,
    property: string,
    newValue: any,
  ) {
    this.props.onLayerChanged(
      this.props.layerIndex,
      changeProperty(this.props.layer, group, property, newValue),
    );
  }

  onGroupToggle(groupTitle: string, active: boolean) {
    const changedActiveGroups = {
      ...this.state.editorGroups,
      [groupTitle]: active,
    };
    this.setState({
      editorGroups: changedActiveGroups,
    });
  }

  renderGroupType(type: string, fields?: string[]): JSX.Element {
    let comment = "";
    if (this.props.layer.metadata) {
      comment = (this.props.layer.metadata as any)["maputnik:comment"];
    }
    const { errors, layerIndex } = this.props;

    const errorData: {
      [key in LayerSpecification as string]: { message: string };
    } = {};
    errors!.forEach((error) => {
      if (
        error.parsed &&
        error.parsed.type === "layer" &&
        error.parsed.data.index == layerIndex
      ) {
        errorData[error.parsed.data.key] = {
          message: error.parsed.data.message,
        };
      }
    });

    let sourceLayerIds;
    const layer = this.props.layer as Exclude<
      LayerSpecification,
      BackgroundLayerSpecification
    >;
    if (Object.hasOwn(this.props.sources, layer.source)) {
      sourceLayerIds = this.props.sources[layer.source].layers;
    }

    switch (type) {
      case "layer":
        return (
          <div>
            <FieldId
              value={this.props.layer.id}
              wdKey="layer-editor.layer-id"
              error={errorData.id}
              onChange={(newId) =>
                this.props.onLayerIdChange(
                  this.props.layerIndex,
                  this.props.layer.id,
                  newId,
                )
              }
            />
            <FieldType
              disabled={true}
              error={errorData.type}
              value={this.props.layer.type}
              onChange={(newType) =>
                this.props.onLayerChanged(
                  this.props.layerIndex,
                  changeType(this.props.layer, newType),
                )
              }
            />
            {this.props.layer.type !== "background" && (
              <FieldSource
                error={errorData.source}
                sourceIds={Object.keys(this.props.sources!)}
                value={this.props.layer.source}
                onChange={(v) => this.changeProperty(null, "source", v)}
              />
            )}
            {!NON_SOURCE_LAYERS.includes(this.props.layer.type) && (
              <FieldSourceLayer
                error={errorData["source-layer"]}
                sourceLayerIds={sourceLayerIds}
                value={(this.props.layer as any)["source-layer"]}
                onChange={(v) => this.changeProperty(null, "source-layer", v)}
              />
            )}
            <FieldMinZoom
              error={errorData.minzoom}
              value={this.props.layer.minzoom}
              onChange={(v) => this.changeProperty(null, "minzoom", v)}
            />
            <FieldMaxZoom
              error={errorData.maxzoom}
              value={this.props.layer.maxzoom}
              onChange={(v) => this.changeProperty(null, "maxzoom", v)}
            />
            <FieldComment
              error={errorData.comment}
              value={comment}
              onChange={(v) =>
                this.changeProperty(
                  "metadata",
                  "maputnik:comment",
                  v == "" ? undefined : v,
                )
              }
            />
          </div>
        );
      case "filter":
        return (
          <div>
            <div className="maputnik-filter-editor-wrapper">
              <FilterEditor
                errors={errorData}
                filter={(this.props.layer as any).filter}
                properties={
                  this.props.vectorLayers[
                    (this.props.layer as any)["source-layer"]
                  ]
                }
                onChange={(f) => this.changeProperty(null, "filter", f)}
              />
            </div>
          </div>
        );
      case "properties":
        return (
          <PropertyGroup
            errors={errorData}
            layer={this.props.layer}
            groupFields={fields!}
            spec={this.props.spec}
            onChange={this.changeProperty.bind(this)}
          />
        );
      case "jsoneditor":
        return (
          <FieldJson
            layer={this.props.layer}
            onChange={(layer) => {
              this.props.onLayerChanged(this.props.layerIndex, layer);
            }}
          />
        );
      default:
        return <></>;
    }
  }

  moveLayer(offset: number) {
    this.props.onMoveLayer({
      oldIndex: this.props.layerIndex,
      newIndex: this.props.layerIndex + offset,
    });
  }

  render() {
    const t = this.props.t;

    const groupIds: string[] = [];
    const layerType = this.props.layer.type;
    const groups = layoutGroups(layerType, t)
      .filter((group) => {
        return !(layerType === "background" && group.type === "source");
      })
      .map((group) => {
        const groupId = group.id;
        groupIds.push(groupId);
        return (
          <LayerEditorGroup
            data-wd-key={group.title}
            id={groupId}
            key={groupId}
            title={group.title}
            isActive={this.state.editorGroups[group.title]}
            onActiveToggle={this.onGroupToggle.bind(this, group.title)}
          >
            {this.renderGroupType(group.type, group.fields)}
          </LayerEditorGroup>
        );
      });

    const layout = this.props.layer.layout || {};

    const items: {
      [key: string]: {
        text: string;
        handler: () => void;
        disabled?: boolean;
        wdKey?: string;
      };
    } = {
      delete: {
        text: t("Delete"),
        handler: () => this.props.onLayerDestroy(this.props.layerIndex),
        wdKey: "menu-delete-layer",
      },
      duplicate: {
        text: t("Duplicate"),
        handler: () => this.props.onLayerCopy(this.props.layerIndex),
        wdKey: "menu-duplicate-layer",
      },
      hide: {
        text: layout.visibility === "none" ? t("Show") : t("Hide"),
        handler: () =>
          this.props.onLayerVisibilityToggle(this.props.layerIndex),
        wdKey: "menu-hide-layer",
      },
      moveLayerUp: {
        text: t("Move layer up"),
        disabled: this.props.isFirstLayer,
        handler: () => this.moveLayer(-1),
        wdKey: "menu-move-layer-up",
      },
      moveLayerDown: {
        text: t("Move layer down"),
        disabled: this.props.isLastLayer,
        handler: () => this.moveLayer(+1),
        wdKey: "menu-move-layer-down",
      },
    };

    function handleSelection(id: string, event: React.SyntheticEvent) {
      event.stopPropagation();
      items[id].handler();
    }

    return (
      <IconContext.Provider value={{ size: "14px", color: "#8e8e8e" }}>
        <section
          className="maputnik-layer-editor"
          role="main"
          aria-label={t("Layer editor")}
          data-wd-key="layer-editor"
        >
          <header>
            <div className="layer-header">
              <h2 className="layer-header__title">
                {t("Layer: {{layerId}}", {
                  layerId: formatLayerId(this.props.layer.id),
                })}
              </h2>
              <div className="layer-header__info">
                <Wrapper
                  className="more-menu"
                  onSelection={handleSelection}
                  closeOnSelection={false}
                >
                  <Button
                    id="skip-target-layer-editor"
                    data-wd-key="skip-target-layer-editor"
                    className="more-menu__button"
                    title={"Layer options"}
                  >
                    <MdMoreVert className="more-menu__button__svg" />
                  </Button>
                  <Menu>
                    <ul className="more-menu__menu">
                      {Object.keys(items).map((id) => {
                        const item = items[id];
                        return (
                          <li key={id}>
                            <MenuItem
                              value={id}
                              className="more-menu__menu__item"
                              data-wd-key={item.wdKey}
                            >
                              {item.text}
                            </MenuItem>
                          </li>
                        );
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
      </IconContext.Provider>
    );
  }
}

const LayerEditor = withTranslation()(LayerEditorInternal);
export default LayerEditor;
