import React from 'react'
import PropTypes from 'prop-types'
import InputString from './InputString'
import InputNumber from './InputNumber'
import InputButton from './InputButton'
import {MdDelete} from 'react-icons/md'
import FieldDocLabel from './FieldDocLabel'
import InputEnum from './InputEnum'
import capitalize from 'lodash.capitalize'
import InputUrl from './InputUrl'


export default class FieldDynamicArray extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    type: PropTypes.string,
    default: PropTypes.array,
    onChange: PropTypes.func,
    style: PropTypes.object,
    fieldSpec: PropTypes.object,
    'aria-label': PropTypes.string,
  }

  changeValue(idx, newValue) {
    const values = this.values.slice(0)
    values[idx] = newValue
    this.props.onChange(values)
  }

  get values() {
    return this.props.value || this.props.default || []
  }

  addValue = () => {
    const values = this.values.slice(0)
    if (this.props.type === 'number') {
      values.push(0)
    }
    else if (this.props.type === 'url') {
      values.push("");
    }
    else if (this.props.type === 'enum') {
      const {fieldSpec} = this.props;
      const defaultValue = Object.keys(fieldSpec.values)[0];
      values.push(defaultValue);
    } else {
      values.push("")
    }

    this.props.onChange(values)
  }

  deleteValue(valueIdx) {
    const values = this.values.slice(0)
    values.splice(valueIdx, 1)

    this.props.onChange(values.length > 0 ? values : undefined);
  }

  render() {
    const inputs = this.values.map((v, i) => {
      const deleteValueBtn= <DeleteValueInputButton onClick={this.deleteValue.bind(this, i)} />
      let input;
      if(this.props.type === 'url') {
        input = <InputUrl
          value={v}
          onChange={this.changeValue.bind(this, i)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      }
      else if (this.props.type === 'number') {
        input = <InputNumber
          value={v}
          onChange={this.changeValue.bind(this, i)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      }
      else if (this.props.type === 'enum') {
        const options = Object.keys(this.props.fieldSpec.values).map(v => [v, capitalize(v)]);
        input = <InputEnum
          options={options}
          value={v}
          onChange={this.changeValue.bind(this, i)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      }
      else {
        input = <InputString
          value={v}
          onChange={this.changeValue.bind(this, i)}
          aria-label={this.props['aria-label'] || this.props.label}
        />
      }

      return <div
        style={this.props.style}
        key={i}
        className="maputnik-array-block"
        >
        <div className="maputnik-array-block-action">
          {deleteValueBtn}
        </div>
        <div className="maputnik-array-block-content">
          {input}
        </div>
      </div>
    })

    return (
      <div className="maputnik-array">
        {inputs}
        <InputButton
          className="maputnik-array-add-value"
          onClick={this.addValue}
        >
          Add value
        </InputButton>
      </div>
    );
  }
}

class DeleteValueInputButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
  }

  render() {
    return <InputButton
      className="maputnik-delete-stop"
      onClick={this.props.onClick}
      title="Remove array item"
    >
      <FieldDocLabel
        label={<MdDelete />}
        doc={"Remove array item."}
      />
    </InputButton>
  }
}

