import React from 'react'
import InputString from './InputString'
import InputNumber from './InputNumber'

export type InputArrayProps = {
  value: (string | number | undefined)[]
  type?: string
  length?: number
  default?: (string | number | undefined)[]
  onChange?(value: (string | number | undefined)[] | undefined): unknown
  'aria-label'?: string
  label?: string
};

type InputArrayState = {
  value: (string | number | undefined)[]
  initialPropsValue: unknown[]
}

export default class InputArray extends React.Component<InputArrayProps, InputArrayState> {
  static defaultProps = {
    value: [],
    default: [],
  }

  constructor (props: InputArrayProps) {
    super(props);
    this.state = {
      value: this.props.value.slice(0),
      // This is so we can compare changes in getDerivedStateFromProps
      initialPropsValue: this.props.value.slice(0),
    };
  }

  static getDerivedStateFromProps(props: Readonly<InputArrayProps>, state: InputArrayState) {
    const value: any[] = [];
    const initialPropsValue = state.initialPropsValue.slice(0);

    Array(props.length).fill(null).map((_, i) => {
      if (props.value[i] === state.initialPropsValue[i]) {
        value[i] = state.value[i];
      }
      else {
        value[i] = state.value[i];
        initialPropsValue[i] = state.value[i];
      }
    })

    return {
      value,
      initialPropsValue,
    };
  }

  isComplete(value: unknown[]) {
    return Array(this.props.length).fill(null).every((_, i) => {
      const val = value[i]
      return !(val === undefined || val === "");
    });
  }

  changeValue(idx: number, newValue: string | number | undefined) {
    const value = this.state.value.slice(0);
    value[idx] = newValue;

    this.setState({
      value,
    }, () => {
      if (this.isComplete(value) && this.props.onChange) {
        this.props.onChange(value);
      }
      else if (this.props.onChange){
        // Unset until complete
        this.props.onChange(undefined);
      }
    });
  }

  render() {
    const {value} = this.state;

    const containsValues = (
      value.length > 0 &&
      !value.every(val => {
        return (val === "" || val === undefined)
      })
    );

    const inputs = Array(this.props.length).fill(null).map((_, i) => {
      if(this.props.type === 'number') {
        return <InputNumber
          key={i}
          default={containsValues || !this.props.default ? undefined : this.props.default[i] as number}
          value={value[i] as number}
          required={containsValues ? true : false}
          onChange={(v) => this.changeValue(i, v)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      } else {
        return <InputString
          key={i}
          default={containsValues || !this.props.default ? undefined : this.props.default[i] as string}
          value={value[i] as string}
          required={containsValues ? true : false}
          onChange={this.changeValue.bind(this, i)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      }
    })

    return (
      <div className="maputnik-array">
        {inputs}
      </div>
    )
  }
}
