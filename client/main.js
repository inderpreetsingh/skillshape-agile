// Node Modules Css imports
import "react-image-gallery/styles/css/image-gallery.css";
// import 'react-widgets/dist/css/react-widgets.css';

// Run this when the meteor app is started
import '../imports/startup/client';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ReactGA from 'react-ga';

import { MuiThemeProvider } from 'material-ui/styles';

import muiTheme from '/imports/ui/components/landing/components/jss/muitheme.jsx';
import pickerStyles from '/imports/startup/client/material-ui-picker-styles/styles.js';

muiTheme.overrides = pickerStyles;

// All the routes used in application
import Routes from '../imports/startup/routes';

class App extends Component {

  componentWillMount = () => {
    ReactGA.initialize('UA-115928788-1',{
      debug: true
    });
  }

  render() {
    return (
      <MuiThemeProvider theme={muiTheme} >
        <div>
          <Routes />
        </div>
      </MuiThemeProvider>
    )
  }
}


Meteor.startup(() => {
  render(<App />, document.getElementById('app'));
})
