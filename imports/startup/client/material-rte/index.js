import React, { Component } from 'react';

import MuiThemeProvider from '/imports/startup/client/lib/material-ui-old/styles/MuiThemeProvider';
import RichTextEditor from 'react-rte-image';
import getMuiTheme from '/imports/startup/client/lib/material-ui-old/styles/getMuiTheme';
import { material_ui_next_theme } from '/imports/util';

const muiTheme = getMuiTheme({

    palette: {
        primary1Color: material_ui_next_theme.palette.primary[900]
    }
});

export class MaterialRTE extends Component {
    state = {
        value: RichTextEditor.createEmptyValue()
    }
    render() {
        // console.log("muiTheme", muiTheme)
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <RichTextEditor value={this.state.value} {...this.props} />
            </MuiThemeProvider>
        );
    }
}

export default MaterialRTE;