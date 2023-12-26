import React from 'react';
import {useActionState} from './helper';
import FieldUrl from '../src/components/FieldUrl';
import {Wrapper} from './ui';

export default {
  title: 'FieldUrl',
  component: FieldUrl,
};


export const Valid = () => {
  const [value, setValue] = useActionState("onChange", "http://example.com");

  return (
    <Wrapper>
      <FieldUrl
        label="Foobar"
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
        label="Foobar"
        value={value}
        onChange={setValue}
        onInput={setValue}
      />
    </Wrapper>
  );
};


