import React from 'react'
import './SmallError.scss';


type SmallErrorProps = {
  children?: React.ReactNode
};


export default class SmallError extends React.Component<SmallErrorProps> {
  render () {
    return (
      <div className="SmallError">
        Error: {this.props.children}
      </div>
    );
  }
}