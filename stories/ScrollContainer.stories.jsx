import React from 'react';
import ScrollContainer from '../src/components/ScrollContainer';
import {Wrapper} from './ui';


export default {
  title: 'ScrollContainer',
  component: ScrollContainer,
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


