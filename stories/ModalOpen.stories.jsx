import React from 'react';
import ModalOpen from '../src/components/ModalOpen';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';


export default {
  title: 'ModalOpen',
  component: ModalOpen,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalOpen
        isOpen={true}
        mapStyle={{}}
        onChangeMetadataProperty={action("onChangeMetadataProperty")}
        onStyleChanged={action("onStyleChanged")}
      />
    </div>
  </Wrapper>
);






