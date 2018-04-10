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
    },
    content: {
      position: "relative",
      padding: 0
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
    },
    schoolInfo: {
      padding: theme.spacing.unit,
    
    },
    roundPapers: {
      height: '100%',
      borderRadius: theme.spacing.unit * 5,
      padding: theme.spacing.unit * 2,
      display: 'flex',
      flexDirection: 'row',
    },
    purchaseBtn: {
      width: '50px',
      boxShadow: 'none',
      borderRadius: '50%',
      height: '60px',
      backgroundColor: '#d94b47',
      color: '#fff'
    },
    dollarStyles: {
      fontSize:'x-large',
      color: '#78c687',
      fontWeight: 700,
      lineHeight: '44px',
      paddingLeft: theme.spacing.unit * 2,
      font: '100 3vw/3vh cookie, cursive',
    },
    mediaContent: {
      position: 'relative',
      padding: 0,
      marginBottom: theme.spacing.unit * 4
    }
  }
}
