import colors from './colors'
import { margins, fontSizes } from './scales'

const border = {
  borderColor: colors.black,
  borderRadius: 0,
}

const dark = {
  name: 'Dark',
  color: colors.white,
  fontFamily: 'Roboto, sans-serif',
  scale: margins,
  fontSizes: fontSizes,
  colors,
  inverted: colors.midGray,
  ...border,

  Block: {
    backgroundColor: colors.gray,
    ...border,
    borderLeft: 0,
    borderRight: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  PanelHeader: {
    marginRight: -10,
    marginBottom: 0,
    fontSize: fontSizes[5],
    fontWeight: 400,
    color: colors.white,
  },
  Panel: {
    backgroundColor: colors.gray,
  },
  Button: {
    color: '#00d9f7',
  },
  Menu: {
    color: '#00d9f7',
    backgroundColor: '#000'
  },
  Message: {
    color: '#111',
    opacity: 15/16
  },
  Header: {
    fontWeight: 400,
  },
  ButtonCircle : {
  },
  Toolbar: {
    fontWeight: 400,
    minHeight: margins[3]
  },
  Label: {
    fontWeight: 300,
  },
  Input: {
    fontWeight: 300,
    fontSize: fontSizes[5],
  }
}

export default dark
