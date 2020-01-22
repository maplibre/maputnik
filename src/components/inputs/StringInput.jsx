import React from 'react'
import PropTypes from 'prop-types'

class StringInput extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    multi: PropTypes.bool,
    required: PropTypes.bool,
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

    return React.createElement(tag, {
      "data-wd-key": this.props["data-wd-key"],
      spellCheck: !(tag === "input"),
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
      required: this.props.required,
    });
  }
}

export default StringInput
