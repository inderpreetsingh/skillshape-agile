export default styles = theme => {
  return {
    schoolHeaderContainer: {
      position: "relative",
      padding: theme.spacing.unit * 2
    },
    imageHeader: {
      top: 0,
      position: "absolute",
      width: "97%",
      padding: theme.spacing.unit * 2,
    },
    imageFooter: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: theme.palette.primary.rgba
    },
    card:{
      width :'100%'
    },
    imageLogoContainer: {
        position: "absolute",
        top: -40,
        zIndex: -1
    },
    logo: {
        height: 100,
        border: '1px solid black',
    },
    logoEditButton: {
        // position: 'absolute',
        width: 44,
        textAlign: 'center',
        padding: 2,
        fontSize: 14,
        // top: 30,
        // left: -8,
        border: '1px solid black',
        backgroundColor: theme.palette.grey[500],
        transform: 'translate(-19%, 70%)',
        cursor: 'pointer',
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
  }
}