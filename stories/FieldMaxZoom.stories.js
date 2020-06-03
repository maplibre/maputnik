import React from 'react';
import {useActionState} from './helper';
import FieldMaxZoom from '../src/components/FieldMaxZoom';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldMaxZoom',
  component: FieldMaxZoom,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", 12);

  return (
    <Wrapper>
      <FieldMaxZoom
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

