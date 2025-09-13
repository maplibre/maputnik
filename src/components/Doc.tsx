import React from "react";

const headers = {
  js: "JS",
  android: "Android",
  ios: "iOS"
};

type DocProps = {
  fieldSpec: {
    doc?: string
    values?: {
      [key: string]: {
        doc?: string
      }
    }
    "sdk-support"?: {
      [key: string]: typeof headers
    }
    docUrl?: string,
    docUrlLinkText?: string
  }
};

export default class Doc extends React.Component<DocProps> {
  render () {
    const {fieldSpec} = this.props;

    const {doc, values, docUrl, docUrlLinkText} = fieldSpec;
    const sdkSupport = fieldSpec["sdk-support"];

    const renderValues = (
      !!values &&
      // HACK: Currently we merge additional values into the style spec, so this is required
      // See <https://github.com/maplibre/maputnik/blob/main/src/components/PropertyGroup.jsx#L16>
      !Array.isArray(values)
    );

    const sdkSupportToJsx = (value: string) => {
      const supportValue = value.toLowerCase();
      if (supportValue.startsWith("https://")) {
        return <a href={supportValue} target="_blank" rel="noreferrer">{"#" + supportValue.split("/").pop()}</a>;
      }
      return value;
    };

    return (
      <>
        {doc &&
          <div className="SpecDoc">
            <div className="SpecDoc__doc" data-wd-key='spec-field-doc'>{doc}</div>
            {renderValues &&
              <ul className="SpecDoc__values">
                {Object.entries(values).map(([key, value]) => {
                  return (
                    <li key={key}>
                      <code>{JSON.stringify(key)}</code>
                      <div>{value.doc}</div>
                    </li>
                  );
                })}
              </ul>
            }
          </div>
        }
        {sdkSupport &&
          <div className="SpecDoc__sdk-support">
            <table className="SpecDoc__sdk-support__table">
              <thead>
                <tr>
                  <th></th>
                  {Object.values(headers).map(header => {
                    return <th key={header}>{header}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {Object.entries(sdkSupport).map(([key, supportObj]) => {
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      {Object.keys(headers).map((k) => {
                        if (Object.prototype.hasOwnProperty.call(supportObj, k)) {
                          return <td key={k}>{sdkSupportToJsx(supportObj[k as keyof typeof headers])}</td>;
                        }
                        else {
                          return <td key={k}>no</td>;
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        }
        {docUrl && docUrlLinkText &&
          <div className="SpecDoc__learn-more">
            <a href={docUrl}  target="_blank" rel="noreferrer">{docUrlLinkText}</a>
          </div>
        }
      </>
    );
  }
}
