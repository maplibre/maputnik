import React from 'react'
import PropTypes from 'prop-types'
import InputJson from './InputJson'


export default class FieldJson extends React.Component {
  static propTypes = {
    ...InputJson.propTypes,
  }

  render() {
    const {props} = this;
    return <InputJson {...props} />
  }
}

