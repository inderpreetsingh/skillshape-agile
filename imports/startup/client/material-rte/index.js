import React, { Component } from 'react';

import MuiThemeProvider from '/imports/startup/client/lib/material-ui-old/styles/MuiThemeProvider';
import getMuiTheme from '/imports/startup/client/lib/material-ui-old/styles/getMuiTheme';
import { material_ui_next_theme } from '/imports/util';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const muiTheme = getMuiTheme({

    palette: {
        primary1Color: material_ui_next_theme.palette.primary[900]
    }
});

export class MaterialRTE extends Component {

    render() {
        // console.log("muiTheme", muiTheme)
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <ReactQuill onChange={this.props.onChange} value={this.props.value} />
            </MuiThemeProvider>
        );
    }
}

export default MaterialRTE;