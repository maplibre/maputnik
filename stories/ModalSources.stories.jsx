import React from 'react';
import ModalSources from '../src/components/ModalSources';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';


export default {
  title: 'ModalSources',
  component: ModalSources,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ModalSources
        isOpen={true}
        mapStyle={{sources: {}}}
        onChangeMetadataProperty={action("onChangeMetadataProperty")}
        onStyleChanged={action("onStyleChanged")}
      />
    </div>
  </Wrapper>
);







