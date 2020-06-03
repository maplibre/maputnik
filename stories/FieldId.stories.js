import React from 'react';
import {useActionState} from './helper';
import FieldId from '../src/components/FieldId';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldId',
  component: FieldId,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "water");

  return (
    <Wrapper>
      <FieldId
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

