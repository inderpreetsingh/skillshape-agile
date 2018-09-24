// Node Modules Css imports
//import "react-image-gallery/styles/css/image-gallery.css";
// import 'react-widgets/dist/css/react-widgets.css';

// Run this when the meteor app is started
//import '../imports/startup/client';
import React, { Component } from "react";
import { render } from "react-dom";
import ReactGA from "react-ga";

import { MuiThemeProvider } from "material-ui/styles";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import pickerStyles from "/imports/startup/client/material-ui-picker-styles/styles.js";
import FirstTimeVisitDialogBox from "/imports/ui/components/landing/components/dialogs/FirstTimeVisitDialogBox.jsx";

muiTheme.overrides = pickerStyles;

// All the routes used in application
import Routes from "../imports/startup/routes";

class App extends Component {
  constructor(props) {
    super(props);
  }

  _isEmbedLink = () => {
    return window.location.href.indexOf("embed") !== -1;
  };

  componentDidMount = () => {
    ReactGA.initialize("UA-115928788-1", {
      debug: true
    });
    // setting it false for first visit(One time redirect)..
    localStorage.setItem("visitorRedirected", false);
  };

  componentWillUnmount = () => {
    // console.log("visitorRedirected, setting false.......")
    localStorage.setItem("visitorRedirected", false);
    localStorage.setItem("mySchoolSlug", null);
    localStorage.setItem("multipleSchools", true);
  };

  render() {
    const visitorTypeValue = localStorage.getItem("visitorType");

    return (
      <MuiThemeProvider theme={muiTheme}>
        {!visitorTypeValue &&
          !this._isEmbedLink() && <FirstTimeVisitDialogBox />}
        <div>
          <Routes />
        </div>
      </MuiThemeProvider>
    );
  }
}

render(<App />, document.getElementById("app"));
