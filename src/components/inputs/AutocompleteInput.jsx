import React from 'react'
import classnames from 'classnames'
import Autocomplete from 'react-autocomplete'


class AutocompleteInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string,
    options: React.PropTypes.array,
    onChange: React.PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
    options: [],
  }

  render() {

    const AutocompleteMenu = (items, value, style) => <div className={"maputnik-autocomplete-menu"} children={props.items} />

    return <Autocomplete
      wrapperProps={{
        className: "maputnik-autocomplete",
        style: null
      }}
      renderMenu={AutocompleteMenu}
      inputProps={{
        className: "maputnik-string"
      }}
      value={this.props.value}
      items={this.props.options}
      getItemValue={(item) => item[0]}
      onSelect={v => this.props.onChange(v)}
      onChange={(e, v) => this.props.onChange(v)}
      renderItem={(item, isHighlighted) => (
        <div
          key={item[0]}
          className={classnames({
            "maputnik-autocomplete-menu-item": true,
            "maputnik-autocomplete-menu-item-selected": isHighlighted,
          })}
        >
         {item[1]}
        </div>
      )}
    />
  }
}

export default AutocompleteInput
