import React from 'react';
import ModalSources from '../src/components/ModalSources';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'ModalSources',
  component: ModalSources,
  decorators: [withA11y],
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







