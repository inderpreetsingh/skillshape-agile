import React, { Component } from 'react';
import { material_ui_next_theme } from '/imports/util';
import MuiThemeProvider from '/imports/startup/client/lib/material-ui-old/styles/MuiThemeProvider';
import getMuiTheme from '/imports/startup/client/lib/material-ui-old/styles/getMuiTheme';
import DatePicker from '/imports/startup/client/lib/material-ui-old/DatePicker';
import TimePicker from '/imports/startup/client/lib/material-ui-old/TimePicker';

const muiTheme = getMuiTheme({

    palette: {
        primary1Color: material_ui_next_theme.palette.primary[900]
    }
});

export class MaterialTimePicker extends Component {

	render() {
		const { required, format, hintText, floatingLabelText, value, fullWidth } = this.props;
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<TimePicker
                    required={required}
                    format={format}
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