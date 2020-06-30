import React from 'react';
import ModalSettings from '../src/components/ModalSettings';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'ModalSettings',
  component: ModalSettings,
  decorators: [withA11y],
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




