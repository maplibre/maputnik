import React from 'react'
import Autocomplete from 'react-autocomplete'
import input from '../../config/input'
import colors from '../../config/colors'
import { margins, fontSizes } from '../../config/scales'

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
    return <Autocomplete
      wrapperProps={{
        className: "maputnik-autocomplete",
        style: null
      }}
      menuStyle={{
        border: 'none',
        padding: '2px 0',
        position: 'fixed',
        overflow: 'auto',
        maxHeight: '50%',
        background: colors.gray,
        zIndex: 3,
      }}
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
          style={{
            userSelect: 'none',
            color: colors.lowgray,
            cursor: 'default',
            background: isHighlighted ? colors.midgray : colors.gray,
            padding: margins[0],
            fontSize: fontSizes[5],
            zIndex: 3,
          }}
        >
         {item[1]}
        </div>
      )}
    />
  }
}

export default AutocompleteInput
