import React from 'react';
import InputJson from '../src/components/InputJson';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'InputJson',
  component: InputJson,
  decorators: [withA11y],
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

