import React from 'react';
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import { withStyles, material_ui_next_theme } from '/imports/util';

const theme = createMuiTheme({...material_ui_next_theme});

const styles = theme => ({
  content: {
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing.unit*10,
    overflow: 'hidden',
  }
});

class PublicLayout extends React.Component {

  constructor( props ) {
    super( props );
  }

  getMainPanelRef() {
    return this.mainPanelRef
  }

  render( ) {
    console.log("PublicLayout  props -->>",this.props);
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
      <MuiThemeProvider theme={theme}>
        <div className={className.mainClass} id={className.id}>
            <BrandBar {...this.props}/>
            <div ref={(ref)=> {this.mainPanelRef = ref}}>
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

export default withStyles(styles)(PublicLayout);