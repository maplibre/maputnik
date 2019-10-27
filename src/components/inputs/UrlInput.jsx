import React from 'react'
import PropTypes from 'prop-types'
import StringInput from './StringInput'
import SmallError from '../util/SmallError'

class UrlInput extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    onChange: PropTypes.func,
    multi: PropTypes.bool,
    required: PropTypes.bool,
  }

  state = {
    error: null,
  }

  onInput = (url) => {
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
      protocol === "https:" &&
      window.location.protocol !== "http:"
    ) {
      error = (
        <SmallError>
        CORs policy won't allow fetching resources served over http from https, use a <code>https://</code> domain
        </SmallError>
      );
    }

    this.setState({error});
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
