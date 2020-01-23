import React from 'react'

export default function SpecDoc (props={}) {
  const {fieldSpec} = props;

  const {doc} = fieldSpec;
  const sdkSupport = fieldSpec['sdk-support'];

  const headers = {
    js: "JS",
    android: "Android",
    ios: "iOS",
    macos: "macOS",
  };

  return (
    <>
      {doc && 
        <div>{doc}</div>
      }
      {sdkSupport &&
        <div className="sdk-support">
          <table className="sdk-support__table">
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
                    {Object.keys(headers).map(k => {
                      const value = supportObj[k];
                      if (supportObj.hasOwnProperty(k)) {
                        return <td key={k}>{supportObj[k]}</td>;
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
    </>
  );
}
