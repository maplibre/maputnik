import React, {type JSX, useEffect, useRef, useState} from "react";
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

import { LayerListGroup } from "./LayerListGroup";
import { LayerListItem } from "./LayerListItem";
import { ModalAdd } from "./modals/ModalAdd";

import type {LayerSpecification, SourceSpecification} from "maplibre-gl";
import { generateUniqueId } from "../libs/document-uid";
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

const noopLayerSelect = () => {};

// Replaces the previous `shouldComponentUpdate`. Note the inversion: this
// returns true when the props are EQUAL (i.e. no re-render is needed), whereas
// `shouldComponentUpdate` returned true when a re-render WAS needed.
function arePropsEqual(prevProps: LayerListContainerInternalProps, nextProps: LayerListContainerInternalProps) {
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
    prevProps.layers.map(getRequiredProps),
  );

  function withoutLayers(props: LayerListContainerInternalProps) {
    const out = {
      ...props
    } as LayerListContainerInternalProps & { layers?: any };
    delete out["layers"];
    return out;
  }

  // Compare the props without layers because we've already compared them
  // efficiently above.
  const propsEqual = lodash.isEqual(
    withoutLayers(prevProps),
    withoutLayers(nextProps)
  );

  return layersEqual && propsEqual;
}

// List of collapsible layer editors
function LayerListContainerInternal({
  layers: propsLayers,
  selectedLayerIndex,
  onLayersChange,
  onLayerSelect = noopLayerSelect,
  onLayerDestroy,
  onLayerCopy,
  onLayerVisibilityToggle,
  sources,
  errors,
  t,
}: LayerListContainerInternalProps) {
  const selectedItemRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const hasMountedRef = useRef(false);

  const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});
  const [areAllGroupsExpanded, setAreAllGroupsExpanded] = useState(false);
  const [keys, setKeys] = useState<{[key: string]: number}>(() => ({
    add: +generateUniqueId(),
  }));
  const [isOpen, setIsOpen] = useState<{[key: string]: boolean}>({
    add: false,
  });

  function toggleModal(modalName: string) {
    setKeys(prevKeys => ({
      ...prevKeys,
      [modalName]: +generateUniqueId(),
    }));
    setIsOpen(prevIsOpen => ({
      ...prevIsOpen,
      [modalName]: !prevIsOpen[modalName]
    }));
  }

  const toggleLayers = () => {
    let idx = 0;

    const newGroups: {[key:string]: boolean} = {};

    groupedLayers().forEach(layers => {
      const groupPrefix = layerPrefix(layers[0].id);
      const lookupKey = [groupPrefix, idx].join("-");


      if (layers.length > 1) {
        newGroups[lookupKey] = areAllGroupsExpanded;
      }

      layers.forEach((_layer) => {
        idx += 1;
      });
    });

    setCollapsedGroups(newGroups);
    setAreAllGroupsExpanded(!areAllGroupsExpanded);
  };

  function groupedLayers(): (LayerSpecification & {key: string})[][] {
    const groups = [];
    const layerIdCount = new Map();

    for (let i = 0; i < propsLayers.length; i++) {
      const origLayer = propsLayers[i];
      const previousLayer = propsLayers[i-1];
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

  function toggleLayerGroup(groupPrefix: string, idx: number) {
    const lookupKey = [groupPrefix, idx].join("-");
    setCollapsedGroups(prevCollapsedGroups => {
      const newGroups = { ...prevCollapsedGroups };
      if(lookupKey in prevCollapsedGroups) {
        newGroups[lookupKey] = !prevCollapsedGroups[lookupKey];
      } else {
        newGroups[lookupKey] = false;
      }
      return newGroups;
    });
  }

  function isCollapsed(groupPrefix: string, idx: number) {
    const collapsed = collapsedGroups[[groupPrefix, idx].join("-")];
    return collapsed === undefined ? true : collapsed;
  }

  useEffect(() => {
    // `componentDidUpdate` did not run on mount, so skip the first run here too.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const selectedItemNode = selectedItemRef.current;
    if (selectedItemNode && selectedItemNode.node) {
      const target = selectedItemNode.node;
      const options = {
        root: scrollContainerRef.current,
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
  }, [selectedLayerIndex]);

  const listItems: JSX.Element[] = [];
  let idx = 0;
  const layersByGroup = groupedLayers();
  layersByGroup.forEach(layers => {
    const groupPrefix = layerPrefix(layers[0].id);
    if(layers.length > 1) {
      const currentIdx = idx;
      const grp = <LayerListGroup
        data-wd-key={[groupPrefix, idx].join("-")}
        aria-controls={layers.map(l => l.key).join(" ")}
        key={`group-${groupPrefix}-${idx}`}
        title={groupPrefix}
        isActive={!isCollapsed(groupPrefix, idx) || idx === selectedLayerIndex}
        onActiveToggle={() => toggleLayerGroup(groupPrefix, currentIdx)}
      />;
      listItems.push(grp);
    }

    layers.forEach((layer, idxInGroup) => {
      const groupIdx = findClosestCommonPrefix(propsLayers, idx);

      const layerError = errors.find(error => {
        return (
          error.parsed &&
          error.parsed.type === "layer" &&
          error.parsed.data.index == idx
        );
      });

      const additionalProps: {ref?: React.RefObject<any>} = {};
      if (idx === selectedLayerIndex) {
        additionalProps.ref = selectedItemRef;
      }

      const listItem = <LayerListItem
        className={classnames({
          "maputnik-layer-list-item-collapsed": layers.length > 1 && isCollapsed(groupPrefix, groupIdx) && idx !== selectedLayerIndex,
          "maputnik-layer-list-item-group-last": idxInGroup == layers.length - 1 && layers.length > 1,
          "maputnik-layer-list-item--error": !!layerError
        })}
        key={layer.key}
        id={layer.key}
        layerId={layer.id}
        layerIndex={idx}
        layerType={layer.type}
        visibility={(layer.layout || {}).visibility}
        isSelected={idx === selectedLayerIndex}
        onLayerSelect={onLayerSelect}
        onLayerDestroy={onLayerDestroy}
        onLayerCopy={onLayerCopy}
        onLayerVisibilityToggle={onLayerVisibilityToggle}
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
    ref={scrollContainerRef}
  >
    <ModalAdd
      key={keys.add}
      layers={propsLayers}
      sources={sources}
      isOpen={isOpen.add}
      onOpenToggle={() => toggleModal("add")}
      onLayersChange={onLayersChange}
    />
    <header className="maputnik-layer-list-header" data-wd-key="layer-list.header">
      <span className="maputnik-layer-list-header-title">{t("Layers")}</span>
      <span className="maputnik-space" />
      <div className="maputnik-default-property">
        <div className="maputnik-multibutton">
          <button
            id="skip-target-layer-list"
            data-wd-key="skip-target-layer-list"
            onClick={toggleLayers}
            className="maputnik-button">
            {areAllGroupsExpanded === true ?
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
            onClick={() => toggleModal("add")}
            data-wd-key="layer-list:add-layer"
            className="maputnik-button maputnik-button-selected">
            {t("Add Layer")}
          </button>
        </div>
      </div>
    </header>
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

const LayerListContainer = withTranslation()(React.memo(LayerListContainerInternal, arePropsEqual));

type LayerListProps = LayerListContainerProps & {
  onMoveLayer: OnMoveLayerCallback
};

export const LayerList: React.FC<LayerListProps> = (props) => {
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
