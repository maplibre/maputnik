const caps = {
	textTransform: 'uppercase',
	letterSpacing: '.2em'
}

export const fullHeight = {
	position: "fixed",
	top: 0,
	bottom: 0,
	height: "100%",
}

const baseColors = {
	black: '#242424',
	gray: '#313131',
	midgray: '#778',
	lowgray: '#dcdcdc',
	white: '#fff',
	blue: '#00d9f7',
	green: '#B4C7AD',
	orange: '#fb3',
	red: '#f04',
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

export const colors = {
	...baseColors,
	...themeColors
}

const scale = [3, 5, 10, 30, 40]
const fontSizes = [28, 24, 20, 16, 14, 12, 10]

const border = {
	borderColor: colors.black,
	borderRadius: 0,
}

const dark = {
	name: 'Dark',
	color: colors.white,
	fontFamily: 'Roboto, sans-serif',
	scale,
	fontSizes,
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
		minHeight: scale[3]
	},
	Label: {
		fontWeight: 300,
	},
	Input: {
		fontWeight: 300,
		fontSize: fontSizes[5],
	},
}

export default dark
