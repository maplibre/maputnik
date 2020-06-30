import React from 'react';
import {useActionState} from './helper';
import FieldEnum from '../src/components/FieldEnum';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldEnum',
  component: FieldEnum,
  decorators: [withA11y],
};


export const BasicFew = () => {
  const options = ["Foo", "Bar", "Baz"];
  const [value, setValue] = useActionState("onChange", "Foo");

  return (
    <Wrapper>
      <FieldEnum
        label="Foobar"
        options={options}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const BasicFewWithDefault = () => {
  const options = ["Foo", "Bar", "Baz"];
  const [value, setValue] = useActionState("onChange", null);

  return (
    <Wrapper>
      <FieldEnum
        label="Foobar"
        options={options}
        default={"Baz"}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const BasicMany = () => {
  const options = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  const [value, setValue] = useActionState("onChange", "a");

  return (
    <Wrapper>
      <FieldEnum
        label="Foobar"
        options={options}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const BasicManyWithDefault = () => {
  const options = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  const [value, setValue] = useActionState("onChange", "a");

  return (
    <Wrapper>
      <FieldEnum
        label="Foobar"
        options={options}
        default={"h"}
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};


