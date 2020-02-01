import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames';

import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import CodeMirror from 'codemirror';

import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/edit/matchbrackets'
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
    lineNumbers: PropTypes.bool,
  }

  static defaultProps = {
    lineNumbers: true,
    gutters: ["CodeMirror-lint-markers"],
    getValue: (data) => {
      return JSON.stringify(data, null, 2)
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      prevValue: this.getValue(),
    };
  }

  getValue () {
    return this.props.getValue(this.props.layer);
  }

  componentDidMount () {
    this._doc = CodeMirror(this._el, {
      value: this.getValue(),
      mode: {
        name: "javascript",
        json: true
      },
      lineWrapping: this.props.lineWrapping,
      tabSize: 2,
      theme: 'maputnik',
      viewportMargin: Infinity,
      lineNumbers: this.props.lineNumbers,
      lint: true,
      matchBrackets: true,
      gutters: this.props.gutters,
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
    const style = {};
    if (this.props.maxHeight) {
      style.maxHeight = this.props.maxHeight;
    }

    return <div
      className={classnames("codemirror-container", this.props.className)}
      ref={(el) => this._el = el}
      style={style}
    />
  }
}

export default JSONEditor
