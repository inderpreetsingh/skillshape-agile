// Node Modules Css imports
// import "react-image-gallery/styles/css/image-gallery.css";
// import 'react-widgets/dist/css/react-widgets.css';

// Run this when the meteor app is started
// import '../imports/startup/client';
import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactGA from 'react-ga';
import ErrorBoundary from '/imports/ui/componentHelpers/errorBoundary/errorBoundary';
import { MuiThemeProvider } from 'material-ui/styles';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import pickerStyles from '/imports/startup/client/material-ui-picker-styles/styles';
import FirstTimeVisitDialogBox from '/imports/ui/components/landing/components/dialogs/FirstTimeVisitDialogBox';
import { clearUserCache } from '/imports/util';
import PropTypes from 'prop-types';
// All the routes used in application
import Routes from '../imports/startup/routes';

muiTheme.overrides = pickerStyles;

class App extends Component {
  componentDidMount = () => {
    ReactGA.initialize('UA-115928788-1', {
      debug: true,
    });
    // setting it false for first visit(One time redirect)..
    clearUserCache();
  };

  componentWillUnmount = () => {
    // console.log("visitorRedirected, setting false.......")
    clearUserCache();
  };

  isEmbedLink = () => {
    const { location } = this.props;
    return location.pathname.indexOf('embed') !== -1;
  };

  render() {
    const visitorTypeValue = localStorage.getItem('visitorType');
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div>
          <ErrorBoundary>
            {!visitorTypeValue
              && !Meteor.userId() && (
                <FirstTimeVisitDialogBox isUserSubsReady />
            )}
            <Routes />
          </ErrorBoundary>
        </div>
      </MuiThemeProvider>
    );
  }
}
App.propTypes = {
  location: PropTypes.instanceOf(Object),
};
App.defaultProps = {
  location: {},
};
render(<App />, document.getElementById('app'));
