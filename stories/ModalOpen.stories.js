import React from 'react';
import ModalOpen from '../src/components/ModalOpen';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'ModalOpen',
  component: ModalOpen,
  decorators: [withA11y],
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






