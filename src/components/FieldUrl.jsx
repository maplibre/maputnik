import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import InputUrl from './InputUrl'
import Block from './Block'


export default class FieldUrl extends React.Component {
  static propTypes = {
    ...InputUrl.propTypes,
  }

  render () {
    const {props} = this;

    return (
      <Block label={this.props.label}>
        <InputUrl {...props} />
      </Block>
    );
  }
}

