import React from 'react';
import ModalDebug from '../src/components/ModalDebug';
import {Wrapper} from './ui';


export default {
  title: 'ModalDebug',
  component: ModalDebug,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalDebug
        isOpen={true}
        renderer="mlgljs"
        maplibreGlDebugOptions={{}}
        mapView={{zoom: 1, center: {lat: 0, lng: 0}}}
      />
    </div>
  </Wrapper>
);



