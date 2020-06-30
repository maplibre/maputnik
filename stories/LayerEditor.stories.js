import React from 'react';
import LayerEditor from '../src/components/LayerEditor';
import {action} from '@storybook/addon-actions';
import {withA11y} from '@storybook/addon-a11y';
import {latest} from '@mapbox/mapbox-gl-style-spec'


export default {
  title: 'LayerEditor',
  component: LayerEditor,
  decorators: [withA11y],
};

export const Background = () => (
  <div>
    <LayerEditor
      layer={{id: "background", type: "background"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const Fill = () => (
  <div>
    <LayerEditor
      layer={{id: "fill", type: "fill", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const Line = () => (
  <div>
    <LayerEditor
      layer={{id: "line", type: "line", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const Symbol = () => (
  <div>
    <LayerEditor
      layer={{id: "symbol", type: "symbol", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const Raster = () => (
  <div>
    <LayerEditor
      layer={{id: "raster", type: "raster", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const Cirlce = () => (
  <div>
    <LayerEditor
      layer={{id: "circle", type: "circle", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const FillExtrusion = () => (
  <div>
    <LayerEditor
      layer={{id: "fill-extrusion", type: "fill-extrusion", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const Heatmap = () => (
  <div>
    <LayerEditor
      layer={{id: "heatmap", type: "heatmap", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

export const Hillshade = () => (
  <div>
    <LayerEditor
      layer={{id: "hillshade", type: "hillshade", source: "openmaptiles"}}
      sources={{}}
      vectorLayers={{}}
      spec={latest}
      errors={[]}
      onLayerChanged={() => {}}
      onLayerIdChange={() => {}}
      onMoveLayer={() => {}}
      onLayerDestroy={() => {}}
      onLayerCopy={() => {}}
      onLayerVisibilityToggle={() => {}}
      isFirstLayer={true}
      isLastLayer={false}
      layerIndex={0}
    />
  </div>
);

