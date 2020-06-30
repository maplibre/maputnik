import React from 'react';
import {useActionState} from './helper';
import InputDynamicArray from '../src/components/InputDynamicArray';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'InputDynamicArray',
  component: InputDynamicArray,
  decorators: [withA11y],
};


export const NumberType = () => {
  const [value, setValue] = useActionState("onChange", [1,2,3]);

  return (
    <Wrapper>
      <InputDynamicArray
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
      <InputDynamicArray
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
      <InputDynamicArray
	      fieldSpec={{values: {"foo": null, "bar": null, "baz": null}}}
        type="enum"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};
