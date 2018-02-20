//TODO: instead of * use particular colors we are using in future - when we are final on colors.
import * as colors from 'material-ui/colors';

export const
    /*******FONTS*********/
    //you need to include these fonts in index.html
    specialFont = "'Zilla Slab', serif",
    commonFont =  "'Open Sans', sans-serif",
    baseFontSize = 16,
    baseLineHeight = 1.5,

   /************RHYTHM**************/
    rhythmInc = 0.5,
    oneRow = baseFontSize + (baseFontSize * rhythmInc),
    rhythmDiv = rhythmInc * baseFontSize,

    /***********SIZES***************/
    brandBarHeight = rhythmDiv * 5, //(16/2 * 5 )
    brandBarHeightMobile = rhythmDiv * 6, //(16/2 * 6 ),
    coverHeight = "95vh",
    cardsListWrapperWidth = rhythmDiv * 150,
    maxContainerWidth = 1400,

    /*******BASIC COLORS*********/
    textColor = colors.grey[800],
    headingColor = colors.grey[900],
    lightTextColor = colors.grey[50], //for dark backgrounds
    ignoreMeText = "rgb(154,154,154)",
    defaultInputColor = "rgba(0, 0, 0, 0.42)",

    focalColor = colors.red[700],
    primaryColor = colors.green[500],
    shadowColor = colors.grey[600],
    panelColor = colors.grey[100],
    darkBgColor = colors.grey[800],
    inputErrorColor = '#ff1744',

    caution = '#E9B942',
    action = '#9DC161',
    danger = '#D84B47',
    cancel = '#989797',
    reset = '#989797',
    information = '#348CC0',
    black = '#292828',

    /********** SPECIFIC COLORS **************/
    schoolPageColor = '#f2f2f2',

    /*******BREAKPOINTS*********/
    watch = 320,
    mobile = 500,
    tablet = 800,
    desktop = 1400, // bigScreen is anything above 1400

    /******MISC GLOBALS*******/
    gradientRGB = "255,255,255",
    gradientDirection = "bottom",
    googleButtonColor = 'rgb(221, 75, 57)',
    facebookButtonColor = 'rgb(59, 89, 152)',

    /******RULES**********/
    flexCenter = `display: flex; justify-content: center; align-items: center;`,
    flexHorizontalSpaceBetween = `display: flex; justify-content: space-between; align-items: center;`,
    flexDirectionColumn = `display: flex; flex-direction: column;`,
    hide = `display: none; width: 0; height: 0;`,
    coverBg = `background-size: cover;
            background-repeat: no-repeat;
            background-position: top center;`
;
