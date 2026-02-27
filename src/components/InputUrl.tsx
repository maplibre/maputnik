import React, { type JSX } from "react";
import InputString from "./InputString";
import SmallError from "./SmallError";
import { Trans, type WithTranslation, withTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { ErrorType, validate } from "../libs/urlopen";

function errorTypeToJsx(errorType: ErrorType | undefined, t: TFunction): JSX.Element | undefined {
  switch (errorType) {
    case ErrorType.EmptyHttpsProtocol:
      return (
        <SmallError>
          <Trans t={t}>Must provide protocol: <code>https://</code></Trans>
        </SmallError>
      );
    case ErrorType.EmptyHttpOrHttpsProtocol:
      return (
        <SmallError>
          <Trans t={t}>Must provide protocol: <code>http://</code> or <code>https://</code></Trans>
        </SmallError>
      );
    case ErrorType.CorsError:
      return (
        <SmallError>
          <Trans t={t}>CORS policy won&apos;t allow fetching resources served over http from https, use a <code>https://</code> domain</Trans>
        </SmallError>
      );
    default:
      return undefined;
  }
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
  error?: ErrorType
};

class InputUrlInternal extends React.Component<InputUrlInternalProps, InputUrlState> {
  static defaultProps = {
    onInput: () => {},
  };

  constructor (props: InputUrlInternalProps) {
    super(props);
    this.state = {
      error: validate(props.value),
    };
  }

  onInput = (url: string) => {
    this.setState({
      error: validate(url),
    });
    if (this.props.onInput) this.props.onInput(url);
  };

  onChange = (url: string) => {
    this.setState({
      error: validate(url),
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
        {errorTypeToJsx(this.state.error, this.props.t)}
      </div>
    );
  }
}

const InputUrl = withTranslation()(InputUrlInternal);
export default InputUrl;
