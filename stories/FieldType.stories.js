import React from 'react';
import {useActionState} from './helper';
import FieldType from '../src/components/FieldType';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldType',
  component: FieldType,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "background");

  return (
    <Wrapper>
      <FieldType
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

