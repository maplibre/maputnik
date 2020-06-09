import React from 'react';
import {useActionState} from './helper';
import InputEnum from '../src/components/InputEnum';
import {InputContainer} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputEnum',
  component: InputEnum,
  decorators: [withA11y],
};


export const BasicFew = () => {
  const options = ["Foo", "Bar", "Baz"];
  const [value, setValue] = useActionState("onChange", "Foo");

  return (
    <InputContainer>
      <InputEnum
        options={options}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const BasicFewWithDefault = () => {
  const options = ["Foo", "Bar", "Baz"];
  const [value, setValue] = useActionState("onChange", null);

  return (
    <InputContainer>
      <InputEnum
        options={options}
        default={"Baz"}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const BasicMany = () => {
  const options = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  const [value, setValue] = useActionState("onChange", "a");

  return (
    <InputContainer>
      <InputEnum
        options={options}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};

export const BasicManyWithDefault = () => {
  const options = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  const [value, setValue] = useActionState("onChange", "a");

  return (
    <InputContainer>
      <InputEnum
        options={options}A
        default={"h"}
        value={value}
        onChange={setValue}
      />
    </InputContainer>
  );
};



