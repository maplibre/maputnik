import React from 'react'
import InputString from './InputString'
import SmallError from './SmallError'


function validate(url: string) {
  if (url === "") {
    return;
  }

  let error;
  const getProtocol = (url: string) => {
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

export type FieldUrlProps = {
  "data-wd-key"?: string
  value: string
  style?: object
  default?: string
  onChange(...args: unknown[]): unknown
  onInput?(...args: unknown[]): unknown
  multi?: boolean
  required?: boolean
  'aria-label'?: string
};

type FieldUrlState = {
  error?: React.ReactNode
}

export default class FieldUrl extends React.Component<FieldUrlProps, FieldUrlState> {
  static defaultProps = {
    onInput: () => {},
  }

  constructor (props: FieldUrlProps) {
    super(props);
    this.state = {
      error: validate(props.value)
    };
  }

  onInput = (url: string) => {
    this.setState({
      error: validate(url)
    });
    if (this.props.onInput) this.props.onInput(url);
  }

  onChange = (url: string) => {
    this.setState({
      error: validate(url)
    });
    this.props.onChange(url);
  }

  render () {
    return (
      <div>
        <InputString
          {...this.props}
          onInput={this.onInput}
          onChange={this.onChange}
          aria-label={this.props['aria-label']}
        />
        {this.state.error}
      </div>
    );
  }
}

