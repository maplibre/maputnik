import React from 'react'
import PropTypes from 'prop-types'

export default class Doc extends React.Component {
  static propTypes = {
    fieldSpec: PropTypes.object.isRequired,
  }

  render () {
    const {fieldSpec} = this.props;

    const {doc, values} = fieldSpec;
    const sdkSupport = fieldSpec['sdk-support'];

    const headers = {
      js: "JS",
      android: "Android",
      ios: "iOS",
      macos: "macOS",
    };

    const renderValues = (
      !!values &&
      // HACK: Currently we merge additional values into the stylespec, so this is required
      // See <https://github.com/maputnik/editor/blob/master/src/components/fields/PropertyGroup.jsx#L16>
      !Array.isArray(values)
    );

    return (
      <>
        {doc && 
          <div className="SpecDoc">
            <div className="SpecDoc__doc">{doc}</div>
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
}
