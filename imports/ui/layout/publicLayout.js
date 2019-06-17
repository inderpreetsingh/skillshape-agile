import { get } from 'lodash';
import { MuiThemeProvider } from 'material-ui/styles';
import React from 'react';
import { browserHistory } from 'react-router';
import styled from 'styled-components';
import Footer from '/imports/ui/components/landing/components/footer/index';
import { panelColor } from '/imports/ui/components/landing/components/jss/helpers';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import TopSearchBar from '/imports/ui/components/landing/components/TopSearchBar';
import { checkIsEmailVerified, withStyles } from '/imports/util';

const MainPanel = styled.div`
  position: relative;
  flex: 1 1 0;
`;

const styles = theme => ({
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    height: '100%',
    backgroundColor: panelColor,
    // paddingTop: theme.spacing.unit*10 - theme.spacing.unit/2,
  },
});

class PublicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetPasswordDialogBox: false,
      isBusy: false,
    };
  }

  getMainPanelRef() {
    return this.mainPanelRef;
  }

  componentWillMount() {
    checkIsEmailVerified.call(this, true);
  }

  setPasswordDialogBoxSubmit = (payload, event) => {
    event.preventDefault();
    let errorMessage;
    const { password, confirmPassword } = payload;
    const { currentUser } = this.props;

    if (!password || !confirmPassword) {
      errorMessage = 'Please enter a password';
    } else if (password !== confirmPassword) {
      errorMessage = 'password not match!!!';
    } else {
      this.setState({ isBusy: true });

      Meteor.call('user.setPassword', { password, logout: false }, (err, res) => {
        if (err) {
          errorMessage = err.reason || err.message;
          this.setState({ isBusy: false });
        } else if (res) {
          this.setState({ showSetPasswordDialogBox: false, isBusy: false }, () => {
            const { onBoardingDialogBox } = res || {};
            if (!onBoardingDialogBox) {
              browserHistory.push(`/profile/${get(currentUser, '_id', null)}`);
            } else {
              this.setState({ onBoardingDialogBox });
            }
          });
        }
      });
    }

    if (errorMessage) {
      this.setState({ errorMessage });
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
      currentLocationPathName,
    } = this.props;
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
          {/* <BrandBar {...this.props}/> */}
          <div>
            <TopSearchBar {...this.props} />
          </div>

          <MainPanel
            ref={(ref) => {
              this.mainPanelRef = ref;
            }}
          >
            <main id="ss-main" className={classes.content}>
              {React.cloneElement(this.props.children, {
                currentUser,
                isUserSubsReady,
                previousLocationPathName,
                currentLocationPathName,
              })}
            </main>
          </MainPanel>
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(PublicLayout);
