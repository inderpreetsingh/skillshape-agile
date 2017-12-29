export default styles = theme => {
  return {
    imageContainer: {
      backgroundColor: theme.palette.grey[100],
      position: 'absolute',
      top:0,
      left:0,
      width: '100%',
      height: '100%'
    },
    schoolHeaderContainer: {
      position: "relative",
      padding: theme.spacing.unit * 2
    },
    content: {
      position: "relative",
      padding: theme.spacing.unit * 2
    },
    image: {
      verticalAlign: 'middle',
      width: '100%'
    },
    imageHeader: {
      top: 0,
      position: "absolute",
      width: "97%",
      padding: theme.spacing.unit * 2,
    },
    imageFooter: {
      position: "absolute",
      padding: theme.spacing.unit * 2,
      bottom: 0,
      width: "97%",
      backgroundColor: theme.palette.primary.rgba
    },
    card:{
      width :'100%'
    },
    ImageFooterbutton : {
      marginLeft: 15,
      textDecoration: 'none',
      float: 'right'
    },
    imageFooterBtnContainer: {
      justifyContent: "space-around",
    },
    imageLogoContainer: {
        width: 60,
        height: 60,
        border: '1px solid black',
    },
  }
}