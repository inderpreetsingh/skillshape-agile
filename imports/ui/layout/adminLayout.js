import React from 'react';
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
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

class AdminLayout extends React.Component {

  constructor( props ) {
    super( props );
  }

  getMainPanelRef() {
    return this.mainPanelRef
  }

  render( ) {
    // console.log("Admin layout props -->>",this.props);
    const { currentUser, classes, isUserSubsReady} = this.props;
    let className = {
      mainClass: "wrapper perfectScroll main_wrapper",
      contentClass: "content",
      id: "UserMainPanel",
    }
    if(currentUser) {
      className.mainClass = "main-panel";
      className.contentClass = "content no-padding";
      className.id = "UserMainPanel";
    }
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className={`${className.mainClass} ${classes.wrapper}`} id={className.id}>
            <BrandBar {...this.props}/>
            <div style={{flex: 1}} ref={(ref)=> {this.mainPanelRef = ref}}>
               <main className={classes.content}>
                {React.cloneElement(this.props.children, { currentUser: currentUser, isUserSubsReady: isUserSubsReady })}
               </main>
            </div>
          <Footer />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(AdminLayout);
