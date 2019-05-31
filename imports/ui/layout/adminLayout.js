import { MuiThemeProvider } from 'material-ui/styles';
import React from 'react';
import BrandBar from '/imports/ui/components/landing/components/BrandBar';
import Footer from '/imports/ui/components/landing/components/footer/index';
// const theme = createMuiTheme({...material_ui_next_theme});
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import { withStyles } from '/imports/util';

const styles = theme => ({
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing.unit * 10,
    overflow: 'hidden',
  },
});

class AdminLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  getMainPanelRef() {
    return this.mainPanelRef;
  }

  render() {
    // console.log("Admin layout props -->>",this.props);
    const { currentUser, classes, isUserSubsReady } = this.props;
    const className = {
      mainClass: 'wrapper perfectScroll main_wrapper',
      contentClass: 'content',
      id: 'UserMainPanel',
    };
    if (currentUser) {
      className.mainClass = 'main-panel';
      className.contentClass = 'content no-padding';
      className.id = 'UserMainPanel';
    }
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className={`${className.mainClass} ${classes.wrapper}`} id={className.id}>
          <BrandBar {...this.props} />
          <div
            style={{ flex: 1 }}
            ref={(ref) => {
              this.mainPanelRef = ref;
            }}
          >
            <main id="ss-main" className={classes.content}>
              {React.cloneElement(this.props.children, {
                currentUser,
                isUserSubsReady,
              })}
            </main>
          </div>
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(AdminLayout);
