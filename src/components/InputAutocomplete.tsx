import React from 'react'
import classnames from 'classnames'
import Autocomplete from 'react-autocomplete'


const MAX_HEIGHT = 140;

export type InputAutocompleteProps = {
  value?: string
  options: any[]
  onChange(value: string | undefined): unknown
  keepMenuWithinWindowBounds?: boolean
  'aria-label'?: string
};

export default class InputAutocomplete extends React.Component<InputAutocompleteProps> {
  state = {
    maxHeight: MAX_HEIGHT
  }

  autocompleteMenuEl: HTMLDivElement | null = null;

  static defaultProps = {
    onChange: () => {},
    options: [],
  }

  calcMaxHeight() {
    if(this.props.keepMenuWithinWindowBounds) {
      const maxHeight = window.innerHeight - this.autocompleteMenuEl!.getBoundingClientRect().top;
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

  onChange(v: string) {
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
          style: {}
        }}
        inputProps={{
          'aria-label': this.props['aria-label'],
          className: "maputnik-string",
          spellCheck: false
        }}
        value={this.props.value}
        items={this.props.options}
        getItemValue={(item) => item[0]}
        onSelect={v => this.onChange(v)}
        onChange={(_e, v) => this.onChange(v)}
        shouldItemRender={(item, value="") => {
          if (typeof(value) === "string") {
            return item[0].toLowerCase().indexOf(value.toLowerCase()) > -1
          }
          return false
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


