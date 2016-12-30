const baseColors = {
  black: '#1c1f24',
  gray: '#26282e',
  midgray: '#36383e',
  lowgray: '#8e8e8e',

  white: '#fff',
  blue: '#00d9f7',
  green: '#B4C7AD',
  orange: '#fb3',
  red: '#cf4a4a',
}

const themeColors = {
  primary: baseColors.gray,
  secondary: baseColors.midgray,
  default: baseColors.gray,
  info: baseColors.blue,
  success: baseColors.green,
  warning: baseColors.orange,
  error: baseColors.red
}

const colors = {
  ...baseColors,
  ...themeColors
}

export default colors
