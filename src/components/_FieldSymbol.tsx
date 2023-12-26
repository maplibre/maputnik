import React from 'react'
import FieldAutocomplete from './FieldAutocomplete'


type FieldSymbolProps = {
  value?: string
  icons?: unknown[]
  onChange(...args: unknown[]): unknown
};


export default class FieldSymbol extends React.Component<FieldSymbolProps> {
  static defaultProps = {
    icons: []
  }

  render() {
    return <FieldAutocomplete
      value={this.props.value}
      options={this.props.icons!.map(f => [f, f])}
      onChange={this.props.onChange}
    />
  }
}

