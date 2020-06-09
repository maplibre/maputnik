import React from 'react';
import LayerList from '../src/components/LayerList';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'LayerList',
  component: LayerList,
  decorators: [withA11y],
};

export const Basic = () => (
  <Wrapper>
    <div style={{width: "200px"}}>
      <LayerList
        layers={[
          {
            id: "background",
            type: "background",
          },
          {
            id: "water",
            type: "fill",
            source: "openmaptiles"
          },
          {
            id: "road_trunk",
            type: "line",
            source: "openmaptiles"
          },
          {
            id: "road_minor",
            type: "line",
            source: "openmaptiles"
          },
          {
            id: "building",
            type: "fill",
            source: "openmaptiles"
          },
        ]}
        selectedLayerIndex={0}
        onLayersChange={() => {}}
        onLayerSelect={() => {}}
        onLayerDestroy={() => {}}
        onLayerCopy={() => {}}
        onLayerVisibilityToggle={() => {}}
        onMoveLayer={() => {}}
        sources={{}}
        errors={[]}
      />
    </div>
  </Wrapper>
);


