import React from 'react'
import StringInput from './StringInput'
import NumberInput from './NumberInput'
import Button from '../Button'
import DeleteIcon from 'react-icons/lib/md/delete'
import DocLabel from '../fields/DocLabel'


class DynamicArrayInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.array,
    type: React.PropTypes.string,
    default: React.PropTypes.array,
    onChange: React.PropTypes.func,
  }

  changeValue(idx, newValue) {
    console.log(idx, newValue)
    const values = this.values.slice(0)
    values[idx] = newValue
    this.props.onChange(values)
  }

  get values() {
    return this.props.value || this.props.default || []
  }

  addValue() {
    const values = this.values.slice(0)
    if (this.props.type === 'number') {
      values.push(0)
    } else {
      values.push("")
    }
    

    this.props.onChange(values)
  }

  deleteValue(valueIdx) {
    const values = this.values.slice(0)
    values.splice(valueIdx, 1)

    this.props.onChange(values)
  }

  render() {
    const inputs = this.values.map((v, i) => {
      const deleteValueBtn= <DeleteValueButton onClick={this.deleteValue.bind(this, i)} />
      const input = this.props.type === 'number' 
        ? <NumberInput
          value={v}
          onChange={this.changeValue.bind(this, i)}
        />
        : <StringInput
          value={v}
          onChange={this.changeValue.bind(this, i)}
        />

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

    return <div className="maputnik-array">
      {inputs}
      <Button
        className="maputnik-array-add-value"
        onClick={this.addValue.bind(this)}
      >
        Add value
      </Button>
    </div>
  }
}

function DeleteValueButton(props) {
    return <Button
      className="maputnik-delete-stop"
      onClick={props.onClick}
    >
      <DocLabel
        label={<DeleteIcon />}
        doc={"Remove array entry."}
      />
    </Button>
  }

export default DynamicArrayInput
