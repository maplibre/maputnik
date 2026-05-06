import React, {type JSX} from "react";
import classnames from "classnames";
import lodash from "lodash";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  MdContentCopy,
  MdDelete,
  MdGroupWork,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import LayerListGroup from "./LayerListGroup";
import LayerListItem from "./LayerListItem";
import ModalAdd from "./modals/ModalAdd";

import type {LayerSpecification, SourceSpecification} from "maplibre-gl";
import generateUniqueId from "../libs/document-uid";
import { findClosestCommonPrefix, layerPrefix } from "../libs/layer";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type MappedError, type OnMoveLayerCallback } from "../libs/definitions";

type LayerListContainerProps = {
  layers: LayerSpecification[]
  selectedLayerIndex: number
  onLayersChange(layers: LayerSpecification[]): unknown
  onLayerSelect(index: number): void;
  onLayerDestroy?(...args: unknown[]): unknown
  onLayerCopy(...args: unknown[]): unknown
  onLayerVisibilityToggle(...args: unknown[]): unknown
  sources: Record<string, SourceSpecification & {layers: string[]}>;
  errors: MappedError[]
};
type LayerListContainerInternalProps = LayerListContainerProps & WithTranslation;

type LayerListContainerState = {
  collapsedGroups: {[ket: string]: boolean}
  areAllGroupsExpanded: boolean
  keys: {[key: string]: number}
  isOpen: {[key: string]: boolean}
  selectedLayerIds: string[]
};

type BulkActionButtonProps = {
  icon: React.ReactNode
  label: string
  onClick(): void
  disabled?: boolean
  wdKey: string
};

const BulkActionButton: React.FC<BulkActionButtonProps> = (props) => {
  return <button
    type="button"
    className="maputnik-button maputnik-layer-list-bulk-actions__button"
    data-wd-key={props.wdKey}
    onClick={props.onClick}
    disabled={props.disabled}
    title={props.label}
    aria-label={props.label}
  >
    <span className="maputnik-layer-list-bulk-actions__button-icon">{props.icon}</span>
  </button>;
};

// List of collapsible layer editors
class LayerListContainerInternal extends React.Component<LayerListContainerInternalProps, LayerListContainerState> {
  static defaultProps = {
    onLayerSelect: () => {},
  };
  selectedItemRef: React.RefObject<any>;
  scrollContainerRef: React.RefObject<HTMLElement | null>;

  constructor(props: LayerListContainerInternalProps) {
    super(props);
    this.selectedItemRef = React.createRef();
    this.scrollContainerRef = React.createRef();
    this.state = {
      collapsedGroups: {},
      areAllGroupsExpanded: false,
      keys: {
        add: +generateUniqueId(),
      },
      isOpen: {
        add: false,
      },
      selectedLayerIds: []
    };
  }

  getSelectedLayers() {
    const selectedIds = new Set(this.state.selectedLayerIds);
    return this.props.layers
      .map((layer, index) => ({ layer, index }))
      .filter(({ layer }) => selectedIds.has(layer.id));
  }

  setSelectedLayerIds(layerIds: string[]) {
    const uniqueLayerIds = Array.from(new Set(layerIds));
    this.setState({
      selectedLayerIds: uniqueLayerIds
    });
  }

  onLayerSelectionToggle = (layerId: string, checked: boolean) => {
    const selectedIds = new Set(this.state.selectedLayerIds);
    if (checked) {
      selectedIds.add(layerId);
    } else {
      selectedIds.delete(layerId);
    }
    this.setSelectedLayerIds(Array.from(selectedIds));
  };

  clearLayerSelection = () => {
    if (this.state.selectedLayerIds.length > 0) {
      this.setSelectedLayerIds([]);
    }
  };

  toggleSelectedVisibility = (visibility: "visible" | "none") => {
    const selectedIds = new Set(this.state.selectedLayerIds);
    const changedLayers = this.props.layers.map(layer => {
      if (!selectedIds.has(layer.id)) {
        return layer;
      }

      const changedLayer = { ...layer };
      const changedLayout = "layout" in changedLayer ? { ...changedLayer.layout } : {};
      changedLayout.visibility = visibility;
      changedLayer.layout = changedLayout;
      return changedLayer;
    });

    this.props.onLayersChange(changedLayers);
  };

  duplicateSelectedLayers = () => {
    const selectedIds = new Set(this.state.selectedLayerIds);
    const changedLayers: LayerSpecification[] = [];

    this.props.layers.forEach(layer => {
      changedLayers.push(layer);
      if (selectedIds.has(layer.id)) {
        const clonedLayer = lodash.cloneDeep(layer);
        clonedLayer.id = `${clonedLayer.id}-copy-${generateUniqueId()}`;
        changedLayers.push(clonedLayer);
      }
    });

    this.props.onLayersChange(changedLayers);
  };

  deleteSelectedLayers = () => {
    const selectedIds = new Set(this.state.selectedLayerIds);
    const changedLayers = this.props.layers.filter(layer => !selectedIds.has(layer.id));
    this.props.onLayersChange(changedLayers);
    this.clearLayerSelection();
  };

  reorderSelectedLayers = (offset: number) => {
    const selectedLayers = this.getSelectedLayers();
    if (selectedLayers.length === 0) {
      return;
    }

    const firstSelectedIndex = selectedLayers[0].index;
    const lastSelectedIndex = selectedLayers[selectedLayers.length - 1].index;

    if (offset < 0 && firstSelectedIndex === 0) {
      return;
    }
    if (offset > 0 && lastSelectedIndex === this.props.layers.length - 1) {
      return;
    }

    const selectedIds = new Set(this.state.selectedLayerIds);
    const selectedLayerObjects: LayerSpecification[] = [];
    const remainingLayers: LayerSpecification[] = [];

    this.props.layers.forEach(layer => {
      if (selectedIds.has(layer.id)) {
        selectedLayerObjects.push(layer);
      } else {
        remainingLayers.push(layer);
      }
    });

    const insertionIndex = Math.max(0, Math.min(remainingLayers.length, firstSelectedIndex + offset));
    const changedLayers = [
      ...remainingLayers.slice(0, insertionIndex),
      ...selectedLayerObjects,
      ...remainingLayers.slice(insertionIndex),
    ];

    this.props.onLayersChange(changedLayers);
  };

  groupSelectedLayersTogether = () => {
    this.reorderSelectedLayers(0);
  };

  toggleModal(modalName: string) {
    this.setState({
      keys: {
        ...this.state.keys,
        [modalName]: +generateUniqueId(),
      },
      isOpen: {
        ...this.state.isOpen,
        [modalName]: !this.state.isOpen[modalName]
      }
    });
  }

  toggleLayers = () => {
    let idx = 0;

    const newGroups: {[key:string]: boolean} = {};

    this.groupedLayers().forEach(layers => {
      const groupPrefix = layerPrefix(layers[0].id);
      const lookupKey = [groupPrefix, idx].join("-");


      if (layers.length > 1) {
        newGroups[lookupKey] = this.state.areAllGroupsExpanded;
      }

      layers.forEach((_layer) => {
        idx += 1;
      });
    });

    this.setState({
      collapsedGroups: newGroups,
      areAllGroupsExpanded: !this.state.areAllGroupsExpanded
    });
  };

  groupedLayers(): (LayerSpecification & {key: string})[][] {
    const groups = [];
    const layerIdCount = new Map();

    for (let i = 0; i < this.props.layers.length; i++) {
      const origLayer = this.props.layers[i];
      const previousLayer = this.props.layers[i-1];
      layerIdCount.set(origLayer.id,
        layerIdCount.has(origLayer.id) ? layerIdCount.get(origLayer.id) + 1 : 0
      );
      const layer = {
        ...origLayer,
        key: `layers-list-${origLayer.id}-${layerIdCount.get(origLayer.id)}`,
      };
      if(previousLayer && layerPrefix(previousLayer.id) == layerPrefix(layer.id)) {
        const lastGroup = groups[groups.length - 1];
        lastGroup.push(layer);
      } else {
        groups.push([layer]);
      }
    }
    return groups;
  }

  toggleLayerGroup(groupPrefix: string, idx: number) {
    const lookupKey = [groupPrefix, idx].join("-");
    const newGroups = { ...this.state.collapsedGroups };
    if(lookupKey in this.state.collapsedGroups) {
      newGroups[lookupKey] = !this.state.collapsedGroups[lookupKey];
    } else {
      newGroups[lookupKey] = false;
    }
    this.setState({
      collapsedGroups: newGroups
    });
  }

  isCollapsed(groupPrefix: string, idx: number) {
    const collapsed = this.state.collapsedGroups[[groupPrefix, idx].join("-")];
    return collapsed === undefined ? true : collapsed;
  }

  shouldComponentUpdate (nextProps: LayerListContainerProps, nextState: LayerListContainerState) {
    // Always update on state change
    if (this.state !== nextState) {
      return true;
    }

    // This component tree only requires id and visibility from the layers
    // objects
    function getRequiredProps(layer: LayerSpecification) {
      const out: {id: string, layout?: { visibility: any}} = {
        id: layer.id,
      };

      if (layer.layout) {
        out.layout = {
          visibility: layer.layout.visibility
        };
      }
      return out;
    }
    const layersEqual = lodash.isEqual(
      nextProps.layers.map(getRequiredProps),
      this.props.layers.map(getRequiredProps),
    );

    function withoutLayers(props: LayerListContainerProps) {
      const out = {
        ...props
      } as LayerListContainerProps & { layers?: any };
      delete out["layers"];
      return out;
    }

    // Compare the props without layers because we've already compared them
    // efficiently above.
    const propsEqual = lodash.isEqual(
      withoutLayers(this.props),
      withoutLayers(nextProps)
    );

    const propsChanged = !(layersEqual && propsEqual);
    return propsChanged;
  }

  componentDidUpdate (prevProps: LayerListContainerProps) {
    if (prevProps.layers !== this.props.layers) {
      const existingIds = new Set(this.props.layers.map(layer => layer.id));
      const selectedLayerIds = this.state.selectedLayerIds.filter(layerId => existingIds.has(layerId));

      if (selectedLayerIds.length !== this.state.selectedLayerIds.length) {
        this.setState({
          selectedLayerIds
        });
      }
    }

    if (prevProps.selectedLayerIndex !== this.props.selectedLayerIndex) {
      const selectedItemNode = this.selectedItemRef.current;
      if (selectedItemNode && selectedItemNode.node) {
        const target = selectedItemNode.node;
        const options = {
          root: this.scrollContainerRef.current,
          threshold: 1.0
        };
        const observer = new IntersectionObserver(entries => {
          observer.unobserve(target);
          if (entries.length > 0 && entries[0].intersectionRatio < 1) {
            target.scrollIntoView();
          }
        }, options);

        observer.observe(target);
      }
    }
  }

  render() {

    const listItems: JSX.Element[] = [];
    let idx = 0;
    const layersByGroup = this.groupedLayers();
    const t = this.props.t;
    const selectedLayers = this.getSelectedLayers();
    const selectedCount = selectedLayers.length;
    const canMoveUp = selectedCount > 0 && selectedLayers[0].index > 0;
    const canMoveDown = selectedCount > 0 && selectedLayers[selectedLayers.length - 1].index < this.props.layers.length - 1;

    const bulkActions = selectedCount > 0 ? <div className="maputnik-layer-list-bulk-actions" data-wd-key="layer-list.bulk-actions">
      <span className="maputnik-layer-list-bulk-actions__count">{selectedCount} selected</span>
      <span className="maputnik-space" />
      <div className="maputnik-multibutton maputnik-layer-list-bulk-actions__buttons">
        <BulkActionButton
          wdKey="layer-list.bulk-actions.hide"
          label={t("Hide all selected")}
          icon={<MdVisibilityOff />}
          onClick={() => this.toggleSelectedVisibility("none")}
        />
        <BulkActionButton
          wdKey="layer-list.bulk-actions.show"
          label={t("Show all selected")}
          icon={<MdVisibility />}
          onClick={() => this.toggleSelectedVisibility("visible")}
        />
        <BulkActionButton
          wdKey="layer-list.bulk-actions.move-up"
          label={t("Move selected layers up")}
          icon={<MdKeyboardArrowUp />}
          onClick={() => this.reorderSelectedLayers(-1)}
          disabled={!canMoveUp}
        />
        <BulkActionButton
          wdKey="layer-list.bulk-actions.move-down"
          label={t("Move selected layers down")}
          icon={<MdKeyboardArrowDown />}
          onClick={() => this.reorderSelectedLayers(1)}
          disabled={!canMoveDown}
        />
        <BulkActionButton
          wdKey="layer-list.bulk-actions.group"
          label={t("Group selected layers together")}
          icon={<MdGroupWork />}
          onClick={this.groupSelectedLayersTogether}
          disabled={selectedCount < 2}
        />
        <BulkActionButton
          wdKey="layer-list.bulk-actions.duplicate"
          label={t("Duplicate selected layers")}
          icon={<MdContentCopy />}
          onClick={this.duplicateSelectedLayers}
        />
        <BulkActionButton
          wdKey="layer-list.bulk-actions.delete"
          label={t("Delete all selected")}
          icon={<MdDelete />}
          onClick={this.deleteSelectedLayers}
        />
      </div>
    </div> : null;

    layersByGroup.forEach(layers => {
      const groupPrefix = layerPrefix(layers[0].id);
      if(layers.length > 1) {
        const grp = <LayerListGroup
          data-wd-key={[groupPrefix, idx].join("-")}
          aria-controls={layers.map(l => l.key).join(" ")}
          key={`group-${groupPrefix}-${idx}`}
          title={groupPrefix}
          isActive={!this.isCollapsed(groupPrefix, idx) || idx === this.props.selectedLayerIndex}
          onActiveToggle={this.toggleLayerGroup.bind(this, groupPrefix, idx)}
        />;
        listItems.push(grp);
      }

      layers.forEach((layer, idxInGroup) => {
        const groupIdx = findClosestCommonPrefix(this.props.layers, idx);

        const layerError = this.props.errors.find(error => {
          return (
            error.parsed &&
            error.parsed.type === "layer" &&
            error.parsed.data.index == idx
          );
        });

        const additionalProps: {ref?: React.RefObject<any>} = {};
        if (idx === this.props.selectedLayerIndex) {
          additionalProps.ref = this.selectedItemRef;
        }

        const listItem = <LayerListItem
          className={classnames({
            "maputnik-layer-list-item-collapsed": layers.length > 1 && this.isCollapsed(groupPrefix, groupIdx) && idx !== this.props.selectedLayerIndex,
            "maputnik-layer-list-item-group-last": idxInGroup == layers.length - 1 && layers.length > 1,
            "maputnik-layer-list-item--error": !!layerError,
            "maputnik-layer-list-item--bulk-selected": selectedLayers.some(selectedLayer => selectedLayer.index === idx)
          })}
          key={layer.key}
          id={layer.key}
          layerId={layer.id}
          layerIndex={idx}
          layerType={layer.type}
          visibility={(layer.layout || {}).visibility}
          isSelected={idx === this.props.selectedLayerIndex}
          isBulkSelected={selectedLayers.some(selectedLayer => selectedLayer.index === idx)}
          onLayerSelect={this.props.onLayerSelect}
          onLayerDestroy={this.props.onLayerDestroy?.bind(this)}
          onLayerCopy={this.props.onLayerCopy.bind(this)}
          onLayerVisibilityToggle={this.props.onLayerVisibilityToggle.bind(this)}
          onLayerSelectionToggle={this.onLayerSelectionToggle}
          {...additionalProps}
        />;
        listItems.push(listItem);
        idx += 1;
      });
    });

    return <section
      className="maputnik-layer-list"
      data-wd-key="layer-list"
      role="complementary"
      aria-label={t("Layers list")}
      ref={this.scrollContainerRef}
    >
      <ModalAdd
        key={this.state.keys.add}
        layers={this.props.layers}
        sources={this.props.sources}
        isOpen={this.state.isOpen.add}
        onOpenToggle={this.toggleModal.bind(this, "add")}
        onLayersChange={this.props.onLayersChange}
      />
      <header className="maputnik-layer-list-header" data-wd-key="layer-list.header">
        <span className="maputnik-layer-list-header-title">{t("Layers")}</span>
        <span className="maputnik-space" />
        <div className="maputnik-default-property">
          <div className="maputnik-multibutton">
            <button
              id="skip-target-layer-list"
              data-wd-key="skip-target-layer-list"
              onClick={this.toggleLayers}
              className="maputnik-button">
              {this.state.areAllGroupsExpanded === true ?
                t("Collapse")
                :
                t("Expand")
              }
            </button>
          </div>
        </div>
        <div className="maputnik-default-property">
          <div className="maputnik-multibutton">
            <button
              onClick={this.toggleModal.bind(this, "add")}
              data-wd-key="layer-list:add-layer"
              className="maputnik-button maputnik-button-selected">
              {t("Add Layer")}
            </button>
          </div>
        </div>
      </header>
      {bulkActions}
      <div
        role="navigation"
        aria-label={t("Layers list")}
      >
        <ul className="maputnik-layer-list-container">
          {listItems}
        </ul>
      </div>
    </section>;
  }
}

const LayerListContainer = withTranslation()(LayerListContainerInternal);

type LayerListProps = LayerListContainerProps & {
  onMoveLayer: OnMoveLayerCallback
};

const LayerList: React.FC<LayerListProps> = (props) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (!over) return;

    const oldIndex = props.layers.findIndex(layer => layer.id === active.id);
    const newIndex = props.layers.findIndex(layer => layer.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      props.onMoveLayer({oldIndex, newIndex});
    }
  };

  const layerIds = props.layers.map(layer => layer.id);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={layerIds} strategy={verticalListSortingStrategy}>
        <LayerListContainer {...props} />
      </SortableContext>
    </DndContext>
  );
};

export default LayerList;
