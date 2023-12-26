import React from 'react';
import InputJson from '../src/components/InputJson';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';

export default {
  title: 'InputJson',
  component: InputJson,
};

export const Basic = () => {
  const layer = {
    id: "background",
    type: "background",
  };

  return <Wrapper>
    <InputJson
      layer={layer}
      onClick={action('onClick')}
    />
  </Wrapper>
};

