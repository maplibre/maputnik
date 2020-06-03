import React from 'react';
import Button from '../src/components/Button';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'Button',
  component: Button,
  decorators: [withA11y],
};

export const Basic = () => (
  <Wrapper>
    <Button onClick={action('onClick')}>
      Hello Button
    </Button>
  </Wrapper>
);

