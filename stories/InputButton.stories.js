import React from 'react';
import InputButton from '../src/components/InputButton';
import {action} from '@storybook/addon-actions';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'InputButton',
  component: InputButton,
  decorators: [withA11y],
};

export const Basic = () => (
  <InputContainer>
    <InputButton onClick={action('onClick')}>
      Hello InputButton
    </InputButton>
  </InputContainer>
);

