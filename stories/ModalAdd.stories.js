import React from 'react';
import ModalAdd from '../src/components/ModalAdd';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'ModalAdd',
  component: ModalAdd,
  decorators: [withA11y],
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

