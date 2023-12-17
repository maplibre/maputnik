import React from 'react';
import ModalSettings from '../src/components/ModalSettings';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';

export default {
  title: 'ModalSettings',
  component: ModalSettings,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalSettings
        isOpen={true}
        mapStyle={{}}
        onStyleChanged={action("onStyleChanged")}
        onChangeMetadataProperty={action("onChangeMetadataProperty")}
      />
    </div>
  </Wrapper>
);




