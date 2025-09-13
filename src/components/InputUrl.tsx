import React, { type JSX } from "react";
import InputString from "./InputString";
import SmallError from "./SmallError";
import { Trans, type WithTranslation, withTranslation } from "react-i18next";
import { type TFunction } from "i18next";

function validate(url: string, t: TFunction): JSX.Element | undefined {
  if (url === "") {
    return;
  }

  let error;
  const getProtocol = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol;
    }
    catch (_err) {
      return undefined;
    }
  };
  const protocol = getProtocol(url);
  const isSsl = window.location.protocol === "https:";

  if (!protocol) {
    if (isSsl) {
      error = (
        <SmallError>
          <Trans t={t}>Must provide protocol: <code>https://</code></Trans>
        </SmallError>
      );
    } else {
      error = (
        <SmallError>
          <Trans t={t}>Must provide protocol: <code>http://</code> or <code>https://</code></Trans>
        </SmallError>
      );
    }
  }
  else if (
    protocol &&
    protocol === "http:" &&
    window.location.protocol === "https:"
  ) {
    error = (
      <SmallError>
        <Trans t={t}>
          CORS policy won&apos;t allow fetching resources served over http from https, use a <code>https://</code> domain
        </Trans>
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
  "aria-label"?: string
  type?: string
  className?: string
};

type InputUrlInternalProps = FieldUrlProps & WithTranslation;

type InputUrlState = {
  error?: React.ReactNode
};

class InputUrlInternal extends React.Component<InputUrlInternalProps, InputUrlState> {
  static defaultProps = {
    onInput: () => {},
  };

  constructor (props: InputUrlInternalProps) {
    super(props);
    this.state = {
      error: validate(props.value, props.t),
    };
  }

  onInput = (url: string) => {
    this.setState({
      error: validate(url, this.props.t),
    });
    if (this.props.onInput) this.props.onInput(url);
  };

  onChange = (url: string) => {
    this.setState({
      error: validate(url, this.props.t),
    });
    this.props.onChange(url);
  };

  render () {
    return (
      <div>
        <InputString
          {...this.props}
          onInput={this.onInput}
          onChange={this.onChange}
          aria-label={this.props["aria-label"]}
        />
        {this.state.error}
      </div>
    );
  }
}

const InputUrl = withTranslation()(InputUrlInternal);
export default InputUrl;
