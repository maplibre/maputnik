import React from 'react'
import PropTypes from 'prop-types'

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import CodeMirror from 'codemirror';

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
      isEditing: false,
      prevValue: this.getValue(),
    };
  }

  getValue () {
    return JSON.stringify(this.props.layer, null, 2);
  }

  componentDidMount () {
    this._doc = CodeMirror(this._el, {
      value: this.getValue(),
      mode: {
        name: "javascript",
        json: true
      },
      tabSize: 2,
      theme: 'maputnik',
      viewportMargin: Infinity,
      lineNumbers: true,
      lint: true,
      gutters: ["CodeMirror-lint-markers"],
      scrollbarStyle: "null",
    });

    this._doc.on('change', this.onChange);
    this._doc.on('focus', this.onFocus);
    this._doc.on('blur', this.onBlur);
  }

  onFocus = () => {
    this.setState({
      isEditing: true
    });
  }

  onBlur = () => {
    this.setState({
      isEditing: false
    });
  }

  componentWillUnMount () {
    this._doc.off('change', this.onChange);
    this._doc.off('focus', this.onFocus);
    this._doc.off('blur', this.onBlur);
  }

  componentDidUpdate(prevProps) {
    if (!this.state.isEditing && prevProps.layer !== this.props.layer) {
      this._cancelNextChange = true;
      this._doc.setValue(
        this.getValue(),
      )
    }
  }

  onChange = (e) => {
    if (this._cancelNextChange) {
      this._cancelNextChange = false;
      return;
    }
    const newCode = this._doc.getValue();

    if (this.state.prevValue !== newCode) {
      try {
        const parsedLayer = JSON.parse(newCode)
        this.props.onChange(parsedLayer)
      } catch(err) {
        console.warn(err)
      }
    }

    this.setState({
      prevValue: newCode,
    });
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

    return <div
      className="codemirror-container"
      ref={(el) => this._el = el}
      style={style}
    />
  }
}

export default JSONEditor
