import React from 'react';
import Modal from '../src/components/Modal';
import {Wrapper} from './ui';


export default {
  title: 'Modal',
  component: Modal,
};

export const Basic = () => (
  <Wrapper>
    <div style={{maxHeight: "200px"}}>
      <Modal title="hello" isOpen={true}>
        {[...Array(50).keys()].map(() => {
          return <p>Some text</p>
        })}
      </Modal>
    </div>
  </Wrapper>
);


