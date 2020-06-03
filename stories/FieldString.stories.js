import React from 'react';
import {useActionState} from './helper';
import FieldString from '../src/components/FieldString';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldString',
  component: FieldString,
  decorators: [withA11y],
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "Hello world");

  return (
    <Wrapper>
      <FieldString
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const WithDefault = () => {
  const [value, setValue] = useActionState("onChange", null);

  return (
    <Wrapper>
      <FieldString
        value={value}
        default={"Edit me..."}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const Multiline = () => {
  const [value, setValue] = useActionState("onChange", "Hello\nworld");

  return (
    <Wrapper>
      <FieldString
        multi={true}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const MultilineWithDefault = () => {
  const [value, setValue] = useActionState("onChange", null);

  return (
    <Wrapper>
      <FieldString
        multi={true}
        default={"Edit\nme.."}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

