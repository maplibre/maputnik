import React from 'react';
import {useActionState} from './helper';
import FieldString from '../src/components/FieldString';
import {Wrapper} from './ui';

export default {
  title: 'FieldString',
  component: FieldString,
};


export const Basic = () => {
  const [value, setValue] = useActionState("onChange", "Hello world");

  return (
    <Wrapper>
      <FieldString
        label="Foobar"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

