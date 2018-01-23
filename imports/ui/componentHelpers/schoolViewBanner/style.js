export default styles = theme => {
  return {
    schoolHeaderContainer: {
      position: "relative",
    },
    cardMedia: {
      backgroundColor: theme.palette.primary[500],
      position: "relative",
      minHeight:146,
      textAlign: 'center',
      backgroundSize: "cover"
    },
    imageHeader: {
      top: 0,
      position: "absolute",
      width: "97%",
      textAlign: "right",
      padding: theme.spacing.unit * 2,
    },
    imageFooter: {
      position: "absolute",
      bottom: 0,
      width: "100%"
    },
    card:{
      width :'100%'
    },
    imageLogoContainer: {
        position: "absolute",
        top: -66,
        left: 40
    },
    logo: {
        height: 100,
        border: '1px solid black',
    },
    logoEditButton: {
        position: 'relative',
    },
    bgEditButton: {
        width: 72,
        textAlign: 'center',
        padding: 2,
        fontSize: 14,
        cursor: 'pointer',
    },
    ImageFooterbutton : {
      marginLeft: 15,
      textDecoration: 'none',
      float: 'right'
    },
    imageFooterBtnContainer: {
      justifyContent: "space-around",
    },
    imageContainer: {
      backgroundRepeat: 'no-repeat !important',
      backgroundSize: 'cover !important',
      backgroundPosition: '50% 50% !important',
      height: '320px !important',
      cursor: 'pointer !important',
      '@media screen and (min-height : 1000px)': {
         height: '568px !important',
      },
      '@media screen and (min-height : 850px)': {
         height: '468px !important',
      },
      '@media screen and (min-height : 700px)': {
         height: '368px !important',
      }

    }
  }
}