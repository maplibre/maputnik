import React, {type JSX} from 'react'
import classnames from 'classnames'
import lodash from 'lodash';

import LayerListGroup from './LayerListGroup'
import LayerListItem from './LayerListItem'
import ModalAdd from './ModalAdd'

import {SortEndHandler, SortableContainer} from 'react-sortable-hoc';
import type {LayerSpecification} from 'maplibre-gl';
import generateUniqueId from '../libs/document-uid';
import { findClosestCommonPrefix, layerPrefix } from '../libs/layer';
import { WithTranslation, withTranslation } from 'react-i18next';

type LayerListContainerProps = {
  layers: LayerSpecification[]
  selectedLayerIndex: number
  onLayersChange(layers: LayerSpecification[]): unknown
  onLayerSelect(...args: unknown[]): unknown
  onLayerDestroy?(...args: unknown[]): unknown
  onLayerCopy(...args: unknown[]): unknown
  onLayerVisibilityToggle(...args: unknown[]): unknown
  sources: object
  errors: any[]
};
type LayerListContainerInternalProps = LayerListContainerProps & WithTranslation;

type LayerListContainerState = {
  collapsedGroups: {[ket: string]: boolean}
  areAllGroupsExpanded: boolean
  keys: {[key: string]: number}
  isOpen: {[key: string]: boolean}
};

// List of collapsible layer editors
class LayerListContainerInternal extends React.Component<LayerListContainerInternalProps, LayerListContainerState> {
  static defaultProps = {
    onLayerSelect: () => {},
  }
  selectedItemRef: React.RefObject<any>;
  scrollContainerRef: React.RefObject<HTMLElement>;

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
      }
    }
  }

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
    })
  }

  toggleLayers = () => {
    let idx = 0

    const newGroups: {[key:string]: boolean} = {}

    this.groupedLayers().forEach(layers => {
      const groupPrefix = layerPrefix(layers[0].id)
      const lookupKey = [groupPrefix, idx].join('-')


      if (layers.length > 1) {
        newGroups[lookupKey] = this.state.areAllGroupsExpanded
      }

      layers.forEach((_layer) => {
        idx += 1
      })
    });

    this.setState({
      collapsedGroups: newGroups,
      areAllGroupsExpanded: !this.state.areAllGroupsExpanded
    })
  }

  groupedLayers(): (LayerSpecification & {key: string})[][] {
    const groups = []
    const layerIdCount = new Map();

    for (let i = 0; i < this.props.layers.length; i++) {
      const origLayer = this.props.layers[i];
      const previousLayer = this.props.layers[i-1]
      layerIdCount.set(origLayer.id,
        layerIdCount.has(origLayer.id) ? layerIdCount.get(origLayer.id) + 1 : 0
      );
      const layer = {
        ...origLayer,
        key: `layers-list-${origLayer.id}-${layerIdCount.get(origLayer.id)}`,
      }
      if(previousLayer && layerPrefix(previousLayer.id) == layerPrefix(layer.id)) {
        const lastGroup = groups[groups.length - 1]
        lastGroup.push(layer)
      } else {
        groups.push([layer])
      }
    }
    return groups
  }

  toggleLayerGroup(groupPrefix: string, idx: number) {
    const lookupKey = [groupPrefix, idx].join('-')
    const newGroups = { ...this.state.collapsedGroups }
    if(lookupKey in this.state.collapsedGroups) {
      newGroups[lookupKey] = !this.state.collapsedGroups[lookupKey]
    } else {
      newGroups[lookupKey] = false
    }
    this.setState({
      collapsedGroups: newGroups
    })
  }

  isCollapsed(groupPrefix: string, idx: number) {
    const collapsed = this.state.collapsedGroups[[groupPrefix, idx].join('-')]
    return collapsed === undefined ? true : collapsed
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
      delete out['layers'];
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
    if (prevProps.selectedLayerIndex !== this.props.selectedLayerIndex) {
      const selectedItemNode = this.selectedItemRef.current;
      if (selectedItemNode && selectedItemNode.node) {
        const target = selectedItemNode.node;
        const options = {
          root: this.scrollContainerRef.current,
          threshold: 1.0
        }
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

    const listItems: JSX.Element[] = []
    let idx = 0
    const layersByGroup = this.groupedLayers();
    layersByGroup.forEach(layers => {
      const groupPrefix = layerPrefix(layers[0].id)
      if(layers.length > 1) {
        const grp = <LayerListGroup
          data-wd-key={[groupPrefix, idx].join('-')}
          aria-controls={layers.map(l => l.key).join(" ")}
          key={`group-${groupPrefix}-${idx}`}
          title={groupPrefix}
          isActive={!this.isCollapsed(groupPrefix, idx) || idx === this.props.selectedLayerIndex}
          onActiveToggle={this.toggleLayerGroup.bind(this, groupPrefix, idx)}
        />
        listItems.push(grp)
      }

      layers.forEach((layer, idxInGroup) => {
        const groupIdx = findClosestCommonPrefix(this.props.layers, idx)

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
            'maputnik-layer-list-item-collapsed': layers.length > 1 && this.isCollapsed(groupPrefix, groupIdx) && idx !== this.props.selectedLayerIndex,
            'maputnik-layer-list-item-group-last': idxInGroup == layers.length - 1 && layers.length > 1,
            'maputnik-layer-list-item--error': !!layerError
          })}
          index={idx}
          key={layer.key}
          id={layer.key}
          layerId={layer.id}
          layerIndex={idx}
          layerType={layer.type}
          visibility={(layer.layout || {}).visibility}
          isSelected={idx === this.props.selectedLayerIndex}
          onLayerSelect={this.props.onLayerSelect}
          onLayerDestroy={this.props.onLayerDestroy?.bind(this)}
          onLayerCopy={this.props.onLayerCopy.bind(this)}
          onLayerVisibilityToggle={this.props.onLayerVisibilityToggle.bind(this)}
          {...additionalProps}
        />
        listItems.push(listItem)
        idx += 1
      })
    })

    const t = this.props.t;

    return <section
      className="maputnik-layer-list"
      role="complementary"
      aria-label={t("Layers list")}
      ref={this.scrollContainerRef}
    >
      <ModalAdd
        key={this.state.keys.add}
        layers={this.props.layers}
        sources={this.props.sources}
        isOpen={this.state.isOpen.add}
        onOpenToggle={this.toggleModal.bind(this, 'add')}
        onLayersChange={this.props.onLayersChange}
      />
      <header className="maputnik-layer-list-header">
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
              onClick={this.toggleModal.bind(this, 'add')}
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
    </section>
  }
}

const LayerListContainer = withTranslation()(LayerListContainerInternal);
const LayerListContainerSortable = SortableContainer((props: LayerListContainerProps) => <LayerListContainer {...props} />)

type LayerListProps = LayerListContainerProps & {
  onMoveLayer: SortEndHandler
};

export default class LayerList extends React.Component<LayerListProps> {
  render() {
    return <LayerListContainerSortable
      {...this.props}
      helperClass='sortableHelper'
      onSortEnd={this.props.onMoveLayer.bind(this)}
      useDragHandle={true}
      shouldCancelStart={() => false}
    />
  }
}
