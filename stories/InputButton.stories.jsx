import React from 'react';
import InputButton from '../src/components/InputButton';
import {action} from '@storybook/addon-actions';
import {InputContainer} from './ui';

export default {
  title: 'InputButton',
  component: InputButton,
};

export const Basic = () => (
  <InputContainer>
    <InputButton onClick={action('onClick')}>
      Hello InputButton
    </InputButton>
  </InputContainer>
);

