import React from 'react';
import ModalLoading from '../src/components/ModalLoading';
import {Wrapper} from './ui';


export default {
  title: 'ModalLoading',
  component: ModalLoading,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalLoading
        isOpen={true}
        title="Loading"
        message="Loading 'something.geojson'"
      />
    </div>
  </Wrapper>
);

