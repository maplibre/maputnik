import React from 'react'
import input from '../../config/input.js'
import colors from '../../config/colors'
import { margins } from '../../config/scales'

class CheckboxInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.bool.isRequired,
    style: React.PropTypes.object,
    onChange: React.PropTypes.func,
  }

  render() {
    const styles = {
      root: {
        ...input.base,
        lineHeight: 0.7,
        padding: 0,
        position: 'relative',
        textAlign: 'center ',
        verticalAlign: 'middle',
        cursor: 'pointer'
      },
      input: {
        position: 'absolute',
        zIndex: -1,
        opacity: 0
      },
      box: {
        display: 'inline-block',
        textAlign: 'center ',
        height: 15,
        width: 15,
        marginRight: margins[1],
        marginBottom: null,
        backgroundColor: colors.gray,
        borderRadius: 2,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: colors.gray,
        transition: 'background-color .1s ease-out'
      },
      icon: {
        display: this.props.value ? null : 'none',
        width: '75%',
        height: '75%',
        marginTop: 1,
        fill: colors.lowgray
      }
    }

    return <label style={styles.root}>
      <input
        className="maputnik-checkbox"
        type="checkbox"
        style={{
          ...styles.input,
          ...this.props.style,
        }}
        onChange={e => this.props.onChange(!this.props.value)}
        checked={this.props.value}
      />
      <div style={styles.box}>
        <svg
          viewBox='0 0 32 32'
          style={styles.icon}>
          <path d='M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z' />
        </svg>
      </div>
    </label>
  }
}

export default CheckboxInput
