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
    themeSpacing: {
      padding: theme.spacing.unit
    },
    schoolHeaderContainer: {
      position: "relative",
      padding: theme.spacing.unit * 2
    },
    content: {
      position: "relative"
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
    card:{
      width :'100%'
    },
    formContainer:{
      display: 'inline-flex',
      justifyContent: 'center',
      width: '100%',
    },
    classTypeContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing.unit * 2
    },
    editorTop: {
      marginTop: '24px',
      border: '1px solid #ddd',
      borderRadius: '6px'
    },
    typographyRoot: {
      padding: '10px'
    }

  }
}