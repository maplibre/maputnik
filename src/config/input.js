import colors from './colors'
import { margins, fontSizes } from './scales'

const base = {
  display: 'inline-block',
  boxSizing: 'border-box',
  fontSize: fontSizes[5],
  lineHeight: 2,
  paddingLeft: 5,
  paddingRight: 5,
}

const label = {
  ...base,
  padding: null,
  color: colors.lowgray,
  userSelect: 'none',
}

const property = {
  display: 'block',
  margin: margins[2],
}

const input = {
  ...base,
  border: 'none',
  backgroundColor: colors.gray,
  color: colors.lowgray,
}

const checkbox = {
  ...base,
  border: '1px solid rgb(36, 36, 36)',
  backgroundColor: colors.gray,
  color: colors.lowgray,
}

const select = {
  ...input,
  height: '2.15em',
}

export default {
  base,
  label,
  select,
  input,
  property,
  checkbox,
}
