import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Autocomplete from 'react-autocomplete'


const MAX_HEIGHT = 140;

export default class FieldAutocomplete extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
    keepMenuWithinWindowBounds: PropTypes.bool
  }

  state = {
    maxHeight: MAX_HEIGHT
  }

  static defaultProps = {
    onChange: () => {},
    options: [],
  }

  calcMaxHeight() {
    if(this.props.keepMenuWithinWindowBounds) {
      const maxHeight = window.innerHeight - this.autocompleteMenuEl.getBoundingClientRect().top;
      const limitedMaxHeight = Math.min(maxHeight, MAX_HEIGHT);

      if(limitedMaxHeight != this.state.maxHeight) {
        this.setState({
          maxHeight: limitedMaxHeight
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

  onChange (v) {
    this.props.onChange(v === "" ? undefined : v);
  }

  render() {
    return <div
      ref={(el) => {
        this.autocompleteMenuEl = el;
      }}
    >
      <Autocomplete
        menuStyle={{
          position: "fixed",
          overflow: "auto",
          maxHeight: this.state.maxHeight,
          zIndex: '998'
        }}
        wrapperProps={{
          className: "maputnik-autocomplete",
          style: null
        }}
        inputProps={{
          className: "maputnik-string",
          spellCheck: false
        }}
        value={this.props.value}
        items={this.props.options}
        getItemValue={(item) => item[0]}
        onSelect={v => this.onChange(v)}
        onChange={(e, v) => this.onChange(v)}
        shouldItemRender={(item, value="") => {
          if (typeof(value) === "string") {
            return item[0].toLowerCase().indexOf(value.toLowerCase()) > -1
          }
        }}
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
    </div>
  }
}

