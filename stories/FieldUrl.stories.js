import React from 'react';
import {useActionState} from './helper';
import FieldUrl from '../src/components/FieldUrl';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';

export default {
  title: 'FieldUrl',
  component: FieldUrl,
  decorators: [withA11y],
};


export const Valid = () => {
  const [value, setValue] = useActionState("onChange", "http://example.com");

  return (
    <Wrapper>
      <FieldUrl
        value={value}
        onChange={setValue}
        onInput={setValue}
      />
    </Wrapper>
  );
};

export const Invalid = () => {
  const [value, setValue] = useActionState("onChange", "foo");

  return (
    <Wrapper>
      <FieldUrl
        value={value}
        onChange={setValue}
        onInput={setValue}
      />
    </Wrapper>
  );
};


