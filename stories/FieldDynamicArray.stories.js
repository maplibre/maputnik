import React from 'react';
import {useActionState} from './helper';
import FieldDynamicArray from '../src/components/FieldDynamicArray';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldDynamicArray',
  component: FieldDynamicArray,
  decorators: [withA11y],
};


export const NumberType = () => {
  const [value, setValue] = useActionState("onChange", [1,2,3]);

  return (
    <Wrapper>
      <FieldDynamicArray
        type="number"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const UrlType = () => {
  const [value, setValue] = useActionState("onChange", ["http://example.com"]);

  return (
    <Wrapper>
      <FieldDynamicArray
        type="url"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const EnumType = () => {
  const [value, setValue] = useActionState("onChange", ["foo"]);

  return (
    <Wrapper>
      <FieldDynamicArray
	fieldSpec={{values: {"foo": null, "bar": null, "baz": null}}}
        type="enum"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};
