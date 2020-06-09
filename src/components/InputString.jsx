import React from 'react'
import PropTypes from 'prop-types'

export default class InputString extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    multi: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    spellCheck: PropTypes.bool,
    'aria-label': PropTypes.string,
  }

  static defaultProps = {
    onInput: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      value: props.value || ''
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.editing) {
      return {
        value: props.value
      };
    }
    return {};
  }

  render() {
    let tag;
    let classes;

    if(!!this.props.multi) {
      tag = "textarea"
      classes = [
        "maputnik-string",
        "maputnik-string--multi"
      ]
    }
    else {
      tag = "input"
      classes = [
        "maputnik-string"
      ]
    }

    if(!!this.props.disabled) {
      classes.push("maputnik-string--disabled");
    }

    return React.createElement(tag, {
      "aria-label": this.props["aria-label"],
      "data-wd-key": this.props["data-wd-key"],
      spellCheck: this.props.hasOwnProperty("spellCheck") ? this.props.spellCheck : !(tag === "input"),
      disabled: this.props.disabled,
      className: classes.join(" "),
      style: this.props.style,
      value: this.state.value === undefined ? "" : this.state.value,
      placeholder: this.props.default,
      onChange: e => {
        this.setState({
          editing: true,
          value: e.target.value
        }, () => {
          this.props.onInput(this.state.value);
        });
      },
      onBlur: () => {
        if(this.state.value!==this.props.value) {
          this.setState({editing: false});
          this.props.onChange(this.state.value);
        }
      },
      onKeyDown: (e) => {
        if (e.keyCode === 13) {
          this.props.onChange(this.state.value);
        }
      },
      required: this.props.required,
    });
  }
}


