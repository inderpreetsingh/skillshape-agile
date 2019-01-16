import { get } from "lodash";
import { MuiThemeProvider } from "material-ui/styles";
import React from "react";
import { browserHistory } from "react-router";
import SetPasswordDialogBox from "/imports/ui/components/landing/components/dialogs/SetPasswordDialogBox";
import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
// const theme = createMuiTheme({...material_ui_next_theme});
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import TopSearchBar from "/imports/ui/components/landing/components/TopSearchBar.jsx";
import { withStyles } from "/imports/util";


const styles = theme => ({
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  content: {
    height: '100%',
    backgroundColor: theme.palette.background.default
    // paddingTop: theme.spacing.unit*10 - theme.spacing.unit/2,
  }
});

class PublicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetPasswordDialogBox: false,
      isBusy: false
    };
  }

  getMainPanelRef() {
    return this.mainPanelRef;
  }

  componentWillReceiveProps(nextProps) {
    //debugger;
    // console.log("PublicLayout nextProps -->>",nextProps);
    if (nextProps.currentUser) {
      const passwordSetByUser = get(
        nextProps,
        "currentUser.profile.passwordSetByUser",
        true
      );
      this.setState({
        showSetPasswordDialogBox: !passwordSetByUser
      });
    }
  }

  setPasswordDialogBoxSubmit = (payload, event) => {
    event.preventDefault();
    let errorMessage;
    const { token } = this.props.params;
    const { password, confirmPassword } = payload;
    const { currentUser } = this.props;

    if (!password || !confirmPassword) {
      errorMessage = "Please enter a password";
    } else {
      if (password !== confirmPassword) {
        errorMessage = "password not match!!!";
      } else {
        this.setState({ isBusy: true });

        Meteor.call(
          "user.setPassword",
          { password, logout: false },
          (err, res) => {
            if (err) {
              errorMessage = err.reason || err.message;
              this.setState({ isBusy: false });
            } else {
              this.setState(
                { showSetPasswordDialogBox: false, isBusy: false },
                () => {
                  if (currentUser) {
                    browserHistory.push(`/profile/${get(currentUser, '_id', null)}`);
                  }
                }
              );
            }
          }
        );
      }
    }

    if (errorMessage) {
      this.setState({ errorMessage: errorMessage });
    }
  };

  render() {
    // console.log("PublicLayout  props -->>",this.props);
    // console.log("PublicLayout  state -->>",this.state);
    const {
      currentUser,
      classes,
      isUserSubsReady,
      previousLocationPathName,
      currentLocationPathName
    } = this.props;
    let className = {
      mainClass: "wrapper perfectScroll main_wrapper",
      contentClass: "content",
      id: "UserMainPanel"
    };

    if (currentUser) {
      className.mainClass = "main-panel";
      className.contentClass = "content no-padding";
      className.id = "UserMainPanel";
    }

    return (
      <MuiThemeProvider theme={muiTheme}>
        <div
          className={`${className.mainClass} ${classes.wrapper}`}
          id={className.id}
        >
          {/*<BrandBar {...this.props}/>*/}
          <div>
            <TopSearchBar {...this.props} />
          </div>

          <SetPasswordDialogBox
            open={this.state.showSetPasswordDialogBox}
            onModalClose={() =>
              this.setState({ showSetPasswordDialogBox: false })
            }
            onCompleteButtonClick={this.setPasswordDialogBoxSubmit}
            errorText={this.state.errorMessage}
            isLoading={this.state.isBusy}
          />
          <div
            style={{ flex: 1 }}
            ref={ref => {
              this.mainPanelRef = ref;
            }}
          >
            <main className={classes.content}>
              {React.cloneElement(this.props.children, {
                currentUser,
                isUserSubsReady,
                previousLocationPathName,
                currentLocationPathName
              })}
            </main>
          </div>
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(PublicLayout);
