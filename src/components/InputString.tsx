import React from 'react'

export type InputStringProps = {
  "data-wd-key"?: string
  value?: string
  style?: object
  default?: string
  onChange?(value: string | undefined): unknown
  onInput?(value: string | undefined): unknown
  multi?: boolean
  required?: boolean
  disabled?: boolean
  spellCheck?: boolean
  'aria-label'?: string
  title?: string
};

type InputStringState = {
  editing: boolean
  value?: string
}

export default class InputString extends React.Component<InputStringProps, InputStringState> {
  static defaultProps = {
    onInput: () => {},
  }

  constructor(props: InputStringProps) {
    super(props)
    this.state = {
      editing: false,
      value: props.value || ''
    }
  }

  static getDerivedStateFromProps(props: Readonly<InputStringProps>, state: InputStringState) {
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

    if(this.props.multi) {
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

    if(this.props.disabled) {
      classes.push("maputnik-string--disabled");
    }

    return React.createElement(tag, {
      "aria-label": this.props["aria-label"],
      "data-wd-key": this.props["data-wd-key"],
      spellCheck: Object.prototype.hasOwnProperty.call(this.props, "spellCheck") ? this.props.spellCheck : !(tag === "input"),
      disabled: this.props.disabled,
      className: classes.join(" "),
      style: this.props.style,
      value: this.state.value === undefined ? "" : this.state.value,
      placeholder: this.props.default,
      title: this.props.title,
      onChange: (e: React.BaseSyntheticEvent<Event, HTMLInputElement, HTMLInputElement>) => {
        this.setState({
          editing: true,
          value: e.target.value
        }, () => {
          if (this.props.onInput) this.props.onInput(this.state.value);
        });
      },
      onBlur: () => {
        if(this.state.value!==this.props.value) {
          this.setState({editing: false});
          if (this.props.onChange) this.props.onChange(this.state.value);
        }
      },
      onKeyDown: (e) => {
        if (e.keyCode === 13 && this.props.onChange) {
          this.props.onChange(this.state.value);
        }
      },
      required: this.props.required,
    });
  }
}


