import React from 'react';
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import { withStyles, material_ui_next_theme } from '/imports/util';

// const theme = createMuiTheme({...material_ui_next_theme});
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme.jsx';

const styles = theme => ({
    wrapper : {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        backgroundColor: theme.palette.background.default,
        paddingTop: theme.spacing.unit*10,
        overflow: 'hidden',
    },
});

class EmbedLayout extends React.Component {

  constructor( props ) {
    super( props );
  }

  getMainPanelRef() {
    return this.mainPanelRef
  }

  render( ) {
    // console.log("Admin layout props -->>",this.props);
    const { classes } = this.props;
    let className = {
      mainClass: "wrapper perfectScroll main_wrapper",
      contentClass: "content",
      id: "UserMainPanel",
    }
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className={`${className.mainClass} ${classes.wrapper}`} id={className.id}>
            <div style={{flex: 1}} ref={(ref)=> {this.mainPanelRef = ref}}>
               <main className={classes.content}>
                {React.cloneElement(this.props.children)}
               </main>
            </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(EmbedLayout);
