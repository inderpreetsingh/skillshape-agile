// Node Modules Css imports
import "react-image-gallery/styles/css/image-gallery.css";
// import 'react-widgets/dist/css/react-widgets.css';

// Run this when the meteor app is started
import '../imports/startup/client';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';

import { MuiThemeProvider } from 'material-ui/styles';
import muiTheme from '../imports/ui/components/landing/components/jss/muitheme.jsx';

// All the routes used in application
import Routes from '../imports/startup/routes';

const App = () => (
  <MuiThemeProvider theme={muiTheme} >
    <div>
      <Routes />
    </div>
  </MuiThemeProvider>
)

Meteor.startup(() => {
  render(<App />, document.getElementById('app'));
})
