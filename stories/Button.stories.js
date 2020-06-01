import React from 'react';
import Button from '../src/components/Button';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';

export default {
  title: 'Button',
  component: Button,
};

export const Simple = () => (
  <Wrapper>
    <Button onClick={action('onClick')}>
      Hello Button
    </Button>
  </Wrapper>
);

