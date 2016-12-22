import React from 'react'

import CodeMirror from 'react-codemirror'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'

import colors from '../../config/colors'
import { margins } from '../../config/scales'

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

  onCodeUpdate(newCode) {
    try {
      const parsedLayer = JSON.parse(newCode)
      this.props.onChange(parsedLayer)
    } catch(err) {
      console.warn(err)
      this.setState({
        code: newCode
      })
    }
  }

  render() {
    const codeMirrorOptions = {
      mode: {name: "javascript", json: true},
      tabSize: 2,
      theme: 'maputnik',
      viewportMargin: Infinity,
      lineNumbers: false,
    }

    return <CodeMirror
      value={this.state.code}
      onChange={this.onCodeUpdate.bind(this)}
      options={codeMirrorOptions}
    />
  }
}

export default JSONEditor
