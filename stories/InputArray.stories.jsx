import React from 'react';
import {useActionState} from './helper';
import InputArray from '../src/components/InputArray';
import {Wrapper} from './ui';

export default {
  title: 'InputArray',
  component: InputArray,
};


export const NumberType = () => {
  const [value, setValue] = useActionState("onChange", [1,2,3]);

  return (
    <Wrapper>
      <InputArray
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
      <InputArray
        type="string"
        value={value}
        length={3}
        onChange={setValue}
      />
    </Wrapper>
  );
};


