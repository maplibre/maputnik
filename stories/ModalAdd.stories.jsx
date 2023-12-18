import React from 'react';
import ModalAdd from '../src/components/ModalAdd';
import {Wrapper} from './ui';


export default {
  title: 'ModalAdd',
  component: ModalAdd,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalAdd
        layers={[]}
        sources={{}}
        isOpen={true}
      />
    </div>
  </Wrapper>
);

