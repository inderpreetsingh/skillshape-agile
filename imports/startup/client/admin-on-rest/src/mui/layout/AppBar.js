import React from 'react';
import MuiAppBar from 'material-ui/AppBar';
import muiThemeable from 'material-ui/styles/muiThemeable';

const AppBar = (props) => {
	console.log("props.....", props)
	return (
    <MuiAppBar {...props} />
)};

export default AppBar;
