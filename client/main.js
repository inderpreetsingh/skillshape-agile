// Run this when the meteor app is started
import '../imports/startup/client';
import 'react-widgets/dist/css/react-widgets.css';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';
// All the routes used in application
import Routes from '../imports/startup/routes';

Meteor.startup(() => {
  render(<div>{Routes()}</div>, document.getElementById('app'));
})
