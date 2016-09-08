const caps = {
  textTransform: 'uppercase',
  letterSpacing: '.2em'
}

const dark = {
  name: 'Dark',
  color: '#eee',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  backgroundColor: '#111',
  borderRadius: 5,
  borderColor: `rgba(255, 255, 255, ${1/16})`,

  colors: {
		black: '#242424',
		gray: '#313131',
		white: '#fff',
    blue: '#00d9f7',
    info: '#00d9f7',
    green: '#0f8',
    success: '#0f8',
    orange: '#fb3',
    warning: '#fb3',
    primary: '#778',
    midgray: '#778',
    gray: '#333339',
    secondary: '#333339',
    red: '#f04',
    error: '#f04'
  },
  inverted: '#222',

  scale: [
    3, 5, 10, 20, 40
  ],

  Card: {
    backgroundColor: '#222',
    border: 0,
  },
  Heading: caps,
  Button: {
    color: '#00d9f7',
  },
  ButtonOutline: {
    color: '#00d9f7',
  },
  Toolbar: {
    minHeight: 64,
    color: '#00d9f7',
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  Label: { opacity: 5/8 },
  Menu: {
    color: '#00d9f7',
    backgroundColor: '#000'
  },
  Message: {
    color: '#111',
    opacity: 15/16
  },
  Text: {
    opacity: 7/8
  },
  Footer: {
    opacity: 1/2
  }
}

export default dark
