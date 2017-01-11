import React from 'react'

import CodeMirror from 'react-codemirror'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import '../../codemirror-maputnik.css'


class JSONEditor extends React.Component {
  static propTypes = {
    layer: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      code: JSON.stringify(props.layer, null, 2)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      code: JSON.stringify(nextProps.layer, null, 2)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    try {
      const parsedLayer = JSON.parse(this.state.code)
      // If the structure is still the same do not update
      // because it affects editing experience by reformatting all the time
      return nextState.code !== JSON.stringify(parsedLayer, null, 2)
    } catch(err) {
      return true
    }
  }

  onCodeUpdate(newCode) {
    try {
      const parsedLayer = JSON.parse(newCode)
      this.props.onChange(parsedLayer)
    } catch(err) {
      console.warn(err)
    } finally {
      this.setState({
        code: newCode
      })
    }
  }

  resetValue() {
    console.log('reset')
    this.setState({
      code: JSON.stringify(this.props.layer, null, 2)
    })
  }

  render() {
    const codeMirrorOptions = {
      mode: {name: "javascript", json: true},
      tabSize: 2,
      theme: 'maputnik',
      viewportMargin: Infinity,
      lineNumbers: false,
      scrollbarStyle: "null",
    }

    return <CodeMirror
      value={this.state.code}
      onChange={this.onCodeUpdate.bind(this)}
      onFocusChange={focused => focused ? true : this.resetValue()}
      options={codeMirrorOptions}
    />
  }
}

export default JSONEditor
