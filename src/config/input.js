import colors from './colors'
import { margins, fontSizes } from './scales'

const base = {
  display: 'inline-block',
  fontSize: fontSizes[5],
  lineHeight: 2,
  paddingLeft: 5,
  paddingRight: 5,
}

const label = {
  ...base,
  width: '40%',
  color: colors.lowgray,
  userSelect: 'none',
}

const property = {
  marginTop: margins[2],
  marginBottom: margins[2],
}

const input = {
  ...base,
  border: 'none',
  width: '47%',
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
  width: '50%',
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
