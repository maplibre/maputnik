import React from 'react';
import {useActionState} from './helper';
import FieldArray from '../src/components/FieldArray';
import {Wrapper} from './ui';

export default {
  title: 'FieldArray',
  component: FieldArray,
};


export const NumberType = () => {
  const [value, setValue] = useActionState("onChange", [1,2,3]);

  return (
    <Wrapper>
      <FieldArray
        label="Foobar"
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
        label="Foobar"
        type="string"
        value={value}
        length={3}
        onChange={setValue}
      />
    </Wrapper>
  );
};


