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
import jsonlint from 'jsonlint'
import stringifyPretty from 'json-stringify-pretty-compact'
import '../util/codemirror-mgl';


class JSONEditor extends React.Component {
  static propTypes = {
    layer: PropTypes.any.isRequired,
    maxHeight: PropTypes.number,
    onChange: PropTypes.func,
    lineNumbers: PropTypes.bool,
    lineWrapping: PropTypes.bool,
    getValue: PropTypes.func,
    gutters: PropTypes.array,
    className: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onJSONValid: PropTypes.func,
    onJSONInvalid: PropTypes.func,
    mode: PropTypes.object,
    lint: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
  }

  static defaultProps = {
    lineNumbers: true,
    lineWrapping: false,
    gutters: ["CodeMirror-lint-markers"],
    getValue: (data) => {
      return stringifyPretty(data, {indent: 2, maxLength: 40});
    },
    onFocus: () => {},
    onBlur: () => {},
    onJSONInvalid: () => {},
    onJSONValid: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      prevValue: this.props.getValue(this.props.layer),
    };
  }

  componentDidMount () {
    this._doc = CodeMirror(this._el, {
      value: this.props.getValue(this.props.layer),
      mode: this.props.mode || {
        name: "mgl",
      },
      lineWrapping: this.props.lineWrapping,
      tabSize: 2,
      theme: 'maputnik',
      viewportMargin: Infinity,
      lineNumbers: this.props.lineNumbers,
      lint: this.props.lint || {
        context: "layer"
      },
      matchBrackets: true,
      gutters: this.props.gutters,
      scrollbarStyle: "null",
    });

    this._doc.on('change', this.onChange);
    this._doc.on('focus', this.onFocus);
    this._doc.on('blur', this.onBlur);
  }

  onFocus = () => {
    this.props.onFocus();
    this.setState({
      isEditing: true
    });
  }

  onBlur = () => {
    this.props.onBlur();
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
        this.props.getValue(this.props.layer),
      )
    }
  }

  onChange = (e) => {
    if (this._cancelNextChange) {
      this._cancelNextChange = false;
      this.setState({
        prevValue: this._doc.getValue(),
      })
      return;
    }
    const newCode = this._doc.getValue();

    if (this.state.prevValue !== newCode) {
      let parsedLayer, err;
      try {
        parsedLayer = JSON.parse(newCode);
      } catch(_err) {
        err = _err;
        console.warn(_err)
      }

      if (err) {
        this.props.onJSONInvalid();
      }
      else {
        this.props.onChange(parsedLayer)
        this.props.onJSONValid();
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
