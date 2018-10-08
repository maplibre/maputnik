import React from 'react'
import PropTypes from 'prop-types'

class StringInput extends React.Component {
  static propTypes = {
    "data-wd-key": PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    default: PropTypes.string,
    onChange: PropTypes.func,
    multi: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || ''
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.value !== prevProps.value) {
      this.setState({value: this.props.value})
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
      value: this.state.value,
      placeholder: this.props.default,
      onChange: e => {
        this.setState({
          value: e.target.value
        })
      },
      onBlur: () => {
        if(this.state.value!==this.props.value) this.props.onChange(this.state.value)
      }
    });
  }
}

export default StringInput
