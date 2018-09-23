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
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      code: JSON.stringify(props.layer, null, 2)
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      code: JSON.stringify(props.layer, null, 2)
    };
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
      lineNumbers: true,
      lint: true,
      gutters: ["CodeMirror-lint-markers"],
      scrollbarStyle: "null",
    }

    return <CodeMirror
      value={this.state.code}
      onBeforeChange={(editor, data, value) => this.onCodeUpdate(value)}
      onFocusChange={focused => focused ? true : this.resetValue()}
      options={codeMirrorOptions}
    />
  }
}

export default JSONEditor
