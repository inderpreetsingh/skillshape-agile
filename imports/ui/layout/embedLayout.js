import { MuiThemeProvider } from 'material-ui/styles';
import React from 'react';
// const theme = createMuiTheme({...material_ui_next_theme});
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import { withStyles } from '/imports/util';

const styles = theme => ({
  wrapper: {},
  content: {
    overflow: 'hidden',
  },
});

class EmbedLayout extends React.Component {
  getMainPanelRef() {
    return this.mainPanelRef;
  }

  render() {
    // console.log("Admin layout props -->>",this.props);
    const { classes } = this.props;
    const className = {
      mainClass: 'wrapper perfectScroll main_wrapper',
      contentClass: 'content',
      id: 'UserMainPanel',
    };
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className={`${className.mainClass} ${classes.wrapper}`} id={className.id}>
          <div
            style={{ flex: 1 }}
            ref={(ref) => {
              this.mainPanelRef = ref;
            }}
          >
            <main className={classes.content}>{React.cloneElement(this.props.children)}</main>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(EmbedLayout);
