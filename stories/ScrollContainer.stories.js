import React from 'react';
import ScrollContainer from '../src/components/ScrollContainer';
import {action} from '@storybook/addon-actions';
import {Wrapper} from './ui';
import {withA11y} from '@storybook/addon-a11y';


export default {
  title: 'ScrollContainer',
  component: ScrollContainer,
  decorators: [withA11y],
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <ScrollContainer>
        {[...Array(50).keys()].map(() => {
          return <p>Some text</p>
        })}
      </ScrollContainer>
    </div>
  </Wrapper>
);


