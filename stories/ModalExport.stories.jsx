import React from 'react';
import ModalExport from '../src/components/ModalExport';
import {Wrapper} from './ui';


export default {
  title: 'ModalExport',
  component: ModalExport,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalExport
        isOpen={true}
        mapStyle={{}}
      />
    </div>
  </Wrapper>
);



