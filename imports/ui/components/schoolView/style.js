export default styles = theme => {
  return {
    imageContainer: {
      backgroundColor: theme.palette.grey[100],
      display: 'inline-flex',
      alignItems: 'center',
      color: '#fff',
      width: '100%',
      minHeight: 250,
      justifyContent: 'center',
      backgroundSize: 'auto',
    },
    schoolHeaderContainer: {
      position: "relative",
      padding: theme.spacing.unit * 2
    },
    image: {
      verticalAlign: 'middle',
      width: '100%'
    },
    imageFooter: {
      position: "absolute",
      padding: theme.spacing.unit * 2,
      bottom: 0,
      width: "97%"
    },
    card:{
      width :'100%'
    },
    ImageFooterbutton : {
      marginLeft: 15
    },
    imageFooterBtnContainer: {
      display: "flex",
      justifyContent: "space-around"
    }

  }
}