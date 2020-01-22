import React from 'react'
import PropTypes from 'prop-types'
import StringInput from './StringInput'
import SmallError from '../util/SmallError'


function validate (url) {
  let error;
  const getProtocol = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol;
    }
    catch (err) {
      return undefined;
    }
  };
  const protocol = getProtocol(url);
  if (
    protocol &&
    protocol === "http:" &&
    window.location.protocol === "https:"
  ) {
    error = (
      <SmallError>
        CORS policy won&apos;t allow fetching resources served over http from https, use a <code>https://</code> domain
      </SmallError>
    );
  }

  return error;
}

class UrlInput extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    multi: PropTypes.bool,
    required: PropTypes.bool,
  }

  static defaultProps = {
    onInput: () => {},
  }

  constructor (props) {
    super(props);
    this.state = {
      error: validate(props.value)
    };
  }

  onInput = (url) => {
    this.setState({
      error: validate(url)
    });
    this.props.onInput(url);
  }

  render () {
    return (
      <div>
        <StringInput
          {...this.props}
          onInput={this.onInput}
        />
        {this.state.error}
      </div>
    );
  }
}

export default UrlInput
