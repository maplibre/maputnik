import React from 'react';
import LayerList from '../src/components/LayerList';
import {Wrapper} from './ui';


export default {
  title: 'LayerList',
  component: LayerList,
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


