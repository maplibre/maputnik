/** Common input styling */

import theme from '../theme.js'

const base = {
  display: 'inline-block',
  fontSize: theme.fontSizes[5],
  lineHeight: 2,
  paddingLeft: 5,
  paddingRight: 5,
}

const label = {
  ...base,
  width: '40%',
  color: theme.colors.lowgray,
  userSelect: 'none',
}

const property = {
  marginTop: theme.scale[2],
  marginBottom: theme.scale[2],
}

const input = {
  ...base,
  border: '1px solid rgb(36, 36, 36)',
  width: '47%',
  backgroundColor: theme.colors.gray,
  color: theme.colors.lowgray,
}

const checkbox = {
  ...base,
  border: '1px solid rgb(36, 36, 36)',
  backgroundColor: theme.colors.gray,
  color: theme.colors.lowgray,
}

const select = {
  ...input,
  width: '51%',
  height: '2.3em',
}

export default {
  label,
  select,
  input,
  property,
  checkbox,
}
