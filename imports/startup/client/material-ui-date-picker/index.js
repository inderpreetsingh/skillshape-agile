import React, { Component } from 'react';
import { material_ui_next_theme } from '/imports/util';
import MuiThemeProvider from '/imports/startup/client/lib/material-ui-old/styles/MuiThemeProvider';
import getMuiTheme from '/imports/startup/client/lib/material-ui-old/styles/getMuiTheme';
import DatePicker from '/imports/startup/client/lib/material-ui-old/DatePicker';

const muiTheme = getMuiTheme({

    palette: {
        primary1Color: material_ui_next_theme.palette.primary[900]
    }
});

export class MaterialDatePicker extends Component {

	render() {
		const { required, hintText, floatingLabelText, value, fullWidth } = this.props;
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<DatePicker
                    required={required}
                    hintText={hintText}
                    floatingLabelText={floatingLabelText}
                    value={value}
                    onChange={this.props.onChange} 
                    fullWidth={fullWidth}
                />
			</MuiThemeProvider>
		)
	}
}