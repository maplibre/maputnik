import React, { type JSX, useState } from "react";
import { InputString } from "./InputString";
import { SmallError } from "./SmallError";
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

const InputUrlInternal: React.FC<InputUrlInternalProps> = ({onInput = () => {}, ...props}) => {
  const [error, setError] = useState<ErrorType | undefined>(() => validate(props.value));

  const handleInput = (url: string) => {
    setError(validate(url));
    onInput(url);
  };

  const handleChange = (url: string) => {
    setError(validate(url));
    props.onChange(url);
  };

  return (
    <div>
      <InputString
        {...props}
        onInput={handleInput}
        onChange={handleChange}
        aria-label={props["aria-label"]}
      />
      {errorTypeToJsx(error, props.t)}
    </div>
  );
};

export const InputUrl = withTranslation()(InputUrlInternal);
