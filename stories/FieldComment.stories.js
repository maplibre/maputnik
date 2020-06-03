import React from 'react';
import {useActionState} from './helper';
import FieldComment from '../src/components/FieldComment';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldComment',
  component: FieldComment,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "Hello\nworld");

  return (
    <Wrapper>
      <FieldComment
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

