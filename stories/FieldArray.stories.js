import React from 'react';
import {useActionState} from './helper';
import FieldArray from '../src/components/FieldArray';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldArray',
  component: FieldArray,
  decorators: [withA11y],
};


export const NumberType = () => {
  const [value, setValue] = useActionState("onChange", [1,2,3]);

  return (
    <Wrapper>
      <FieldArray
        type="number"
        value={value}
        length={3}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const StringType = () => {
  const [value, setValue] = useActionState("onChange", ["a", "b", "c"]);

  return (
    <Wrapper>
      <FieldArray
        type="string"
        value={value}
        length={3}
        onChange={setValue}
      />
    </Wrapper>
  );
};


