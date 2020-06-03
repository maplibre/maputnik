import React from 'react';
import {useActionState} from './helper';
import FieldSourceLayer from '../src/components/FieldSourceLayer';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldSourceLayer',
  component: FieldSourceLayer,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "water");

  return (
    <Wrapper>
      <FieldSourceLayer
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

