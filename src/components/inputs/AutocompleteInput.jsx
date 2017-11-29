import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Autocomplete from 'react-autocomplete'


class AutocompleteMenu extends React.Component {
  static propTypes = {
    keepMenuWithinWindowBounds: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node
  }

  calcMaxHeight() {
    if(this.props.keepMenuWithinWindowBounds) {
      const maxHeight = window.innerHeight - this.autocompleteMenuEl.getBoundingClientRect().top;
      if(maxHeight != this.state.maxHeight) {
        this.setState({
          maxHeight: maxHeight
        })
      }
    }
  }
  componentDidMount() {
    this.calcMaxHeight();
  }

  componentDidUpdate() {
    this.calcMaxHeight();
  }

  constructor(props) {
    super(props);
    this.state = {
      maxHeight: 90
    };
  }

  static defaultProps = {
    style: {}
  }

  render() {
    const maxHeight = this.state.maxHeight - this.props.style.marginBottom || 0;
    const style = {
      maxHeight: maxHeight+"px"
    }

    return (
      <div
        ref={(el) => {
          this.autocompleteMenuEl = el;
        }}
        className={"maputnik-autocomplete-menu"}
        style={style}
      >
        {this.props.children}
      </div>
    )
  }
}

class AutocompleteInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
    keepMenuWithinWindowBounds: PropTypes.bool
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
      renderMenu={(items) => {
        return <AutocompleteMenu keepMenuWithinWindowBounds={this.props.keepMenuWithinWindowBounds} style={{marginBottom: 4}}>
          {items}
        </AutocompleteMenu>
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
