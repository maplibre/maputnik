import React from 'react';
import Modal from '../src/components/Modal';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'Modal',
  component: Modal,
  decorators: [withA11y],
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <Modal title="hello" isOpen={true}>
        {[...Array(50).keys()].map(() => {
          return <p>Some text</p>
        })}
      </Modal>
    </div>
  </Wrapper>
);


