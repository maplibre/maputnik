import React from 'react';
import {useActionState} from './helper';
import FieldMinZoom from '../src/components/FieldMinZoom';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldMinZoom',
  component: FieldMinZoom,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", 2);

  return (
    <Wrapper>
      <FieldMinZoom
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

