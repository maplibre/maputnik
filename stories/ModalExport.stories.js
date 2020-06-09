import React from 'react';
import ModalExport from '../src/components/ModalExport';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'ModalExport',
  component: ModalExport,
  decorators: [withA11y],
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



