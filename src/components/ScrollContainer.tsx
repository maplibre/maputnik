import React from 'react'

type ScrollContainerProps = {
  children?: React.ReactNode
};

export default class ScrollContainer extends React.Component<ScrollContainerProps> {
  render() {
    return <div className="maputnik-scroll-container">
      {this.props.children}
    </div>
  }
}
