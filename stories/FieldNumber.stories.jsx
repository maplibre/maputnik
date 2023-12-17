import React from 'react';
import {useActionState} from './helper';
import FieldNumber from '../src/components/FieldNumber';
import {Wrapper} from './ui';

export default {
  title: 'FieldNumber',
  component: FieldNumber,
};

export const Basic = () => {
  const [value, setValue] = useActionState("onChange", 1);

  return (
    <Wrapper>
      <FieldNumber
        label="number"
        value={value}
        onChange={setValue}
      />
    </Wrapper>
  );
};

export const Range = () => {
  const [value, setValue] = useActionState("onChange", 1);

  return (
    <Wrapper>
      <FieldNumber
        label="number"
        value={value}
        onChange={setValue}
        min={1}
        max={24}
        allowRange={true}
        rangeStep={1}
      />
    </Wrapper>
  );
};
