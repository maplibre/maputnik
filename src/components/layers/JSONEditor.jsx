import React from 'react'
import PropTypes from 'prop-types'

import {Controlled as CodeMirror} from 'react-codemirror2'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import '../../codemirror-maputnik.css'
import jsonlint from 'jsonlint'

// This is mainly because of this issue <https://github.com/zaach/jsonlint/issues/57> also the API has changed, see comment in file
import '../../vendor/codemirror/addon/lint/json-lint'


class JSONEditor extends React.Component {
  static propTypes = {
    layer: PropTypes.object.isRequired,
    maxHeight: PropTypes.number,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      code: JSON.stringify(props.layer, null, 2)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.layer !== this.props.layer) {
      this.setState({
        code: JSON.stringify(this.props.layer, null, 2)
      })
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
      lineNumbers: true,
      lint: true,
      gutters: ["CodeMirror-lint-markers"],
      scrollbarStyle: "null",
    }

    const style = {};
    if (this.props.maxHeight) {
      style.maxHeight = this.props.maxHeight;
    }

    return <div className="CodeMirror-wrapper" style={style}>
      <CodeMirror
        value={this.state.code}
        onBeforeChange={(editor, data, value) => this.onCodeUpdate(value)}
        onFocusChange={focused => focused ? true : this.resetValue()}
        options={codeMirrorOptions}
      />
    </div>
  }
}

export default JSONEditor
