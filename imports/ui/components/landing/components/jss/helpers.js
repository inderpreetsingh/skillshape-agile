//TODO: instead of * use particular colors we are using in future - when we are final on colors.
import * as colors from "material-ui/colors";

export const /*******FONTS*********/
  //you need to include these fonts in index.html
  specialFont = "'Zilla Slab', serif",
  commonFont = "'Open Sans', sans-serif",
  fancyFont = "'Playfair Display', serif",
  baseFontSize = 16,
  baseLineHeight = 1.5,
  /************RHYTHM**************/
  rhythmInc = 0.5,
  oneRow = baseFontSize + baseFontSize * rhythmInc,
  rhythmDiv = rhythmInc * baseFontSize,
  /***********SIZES***************/
  brandBarHeight = rhythmDiv * 5, //(16/2 * 5 )
  brandBarHeightMobile = rhythmDiv * 6, //(16/2 * 6 ),
  coverHeight = "95vh",
  cardsListWrapperWidth = rhythmDiv * 150,
  maxContainerWidth = 1400,
  schoolPageContainer = 1000,
  /*******BASIC COLORS*********/
  textColor = colors.grey[800],
  headingColor = colors.grey[900],
  lightTextColor = colors.grey[50], //for dark backgrounds
  secondaryTextColor = colors.grey[500],
  ignoreMeText = "rgb(154,154,154)",
  defaultInputColor = "#A9A9A9",
  focalColor = colors.red[700],
  primaryColor = colors.green[500],
  shadowColor = colors.grey[600],
  panelColor = colors.grey[100],
  darkBgColor = colors.grey[800],
  inputErrorColor = "#ff1744",
  caution = "#E9B942",
  action = "#9DC161",
  danger = "#D84B47",
  cancel = "#989797",
  reset = "#989797",
  information = "#348CC0",
  black = "#292828",
  communication = "#448aff",
  /********** SKILLSHAPE POPUP *************/
  alertColor = "#e84118",
  warningColor = "#ff9966",
  /********** SPECIFIC COLORS **************/
  defaultBoxColor = "#f2f2f2",
  schoolPageColor = "#f2f2f2",
  noMediaFound = "#f9fbe7",
  classTimeClockButtonColor = "152,151,151", // So that it can be used as rgba with varying opacity
  /*******BREAKPOINTS*********/
  watch = 320,
  mobile = 500,
  tablet = 800,
  desktop = 1400, // bigScreen is anything above 1400
  /******MISC GLOBALS*******/
  gradientRGB = "255,255,255",
  gradientDirection = "bottom",
  googleButtonColor = "rgb(221, 75, 57)",
  facebookButtonColor = "rgb(59, 89, 152)",
  overlayColor = "rgba(255,255,255,0.8)",
  inputBoxShadow =
    "0px 1px 0px 0px rgba(0, 0, 0, 0.1), 0px 2px 0px 0px rgba(0, 0, 0, 0.1), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)",
  buttonBoxShadow =
    "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);",
  heavyBoxShadow = buttonBoxShadow,
  /******RULES**********/
  flexCenter = `display: flex; justify-content: center; align-items: center;`,
  flexHorizontalSpaceBetween = `display: flex; justify-content: space-between; align-items: center;`,
  flexDirectionColumn = `display: flex; flex-direction: column;`,
  hide = `display: none; width: 0; height: 0;`,
  clipPathCurve = `ellipse(112% 57% at 51% 43%)`,
  coverBg = `background-size: cover;
            background-repeat: no-repeat;
            background-position: top center;`;
