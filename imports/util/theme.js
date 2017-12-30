import { lightBlue, amber } from 'material-ui/colors';

const themeGreen = {
  50: '#F7F7F1',
  100: '#EDF1E1',
  200: '#E3EBD1',
  300: '#D9E5C1',
  400: '#CFDFB1',
  500: '#C5D9A1',
  600: '#BBD391',
  700: '#B1CD81',
  800: '#A7C771',
  900: '#9DC161',
  A100: '#9DC161',
  A200: '#9DC161',
  A400: '#9DC161',
  A700: '#9DC161',
  contrastDefaultColor: 'dark',
  rgba: 'rgba(157, 193, 97, 0.54)',
};


const themeRed = {
  50: 	'#FCEDE9',
  100: 	'#F8DBD7',
  200: 	'#F4C9C5',
  300: 	'#F0B7B3',
  400: 	'#ECA5A1',
  500: 	'#E8938F',
  600: 	'#E4817D',
  700: 	'#E06F6B',
  800: 	'#DC5D59',
  900: 	'#D84B47',
  A100: '#D84B47',
  A200: '#D84B47',
  A400: '#D84B47',
  A700: '#D84B47',
  contrastDefaultColor: 'dark',
  rgba: 'rgba(216, 75, 71, 0.54)',
};

const themeYellow = {
  50: 	'#FBF8ED',
  100: 	'#F9F1DA',
  200: 	'#F7EAC7',
  300: 	'#F5E3B4',
  400: 	'#F3DCA1',
  500: 	'#F1D58E',
  600: 	'#EFCE7B',
  700: 	'#EDC768',
  800: 	'#EBC055',
  900: 	'#E9B942',
  A100: '#E9B942',
  A200: '#E9B942',
  A400: '#E9B942',
  A700: '#E9B942',
  contrastDefaultColor: 'dark',
  rgba: 'rgba(233, 185, 66, 0.54)',
};

lightBlue.rgba = '#31a9f461'

export const material_ui_next_theme = {
    palette: {
        primary: lightBlue,
        secondary: amber,
        themeColor3: themeYellow
    },
    typography: {
    	button: {
    		fontWeight: 300
    	}
    }
}