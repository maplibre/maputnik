import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import FieldString from './FieldString'
import SmallError from './SmallError'


function validate (url) {
  if (url === "") {
    return;
  }

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
  const isSsl = window.location.protocol === "https:";

  if (!protocol) {
    error = (
      <SmallError>
        Must provide protocol {
          isSsl
          ? <code>https://</code>
          : <><code>http://</code> or <code>https://</code></>
        }
      </SmallError>
    );
  }
  else if (
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

export default class FieldUrl extends React.Component {
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

  onChange = (url) => {
    this.setState({
      error: validate(url)
    });
    this.props.onChange(url);
  }

  render () {
    return (
      <div>
        <FieldString
          {...this.props}
          onInput={this.onInput}
          onChange={this.onChange}
        />
        {this.state.error}
      </div>
    );
  }
}

