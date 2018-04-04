import React, { Component } from 'react';

import { MuiThemeProvider} from 'material-ui';
import { TimePicker } from 'material-ui-pickers'
import TextField from 'material-ui/TextField';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme.jsx';
import timePickerOverridenStyles from './styles';

muiTheme.overrides = timePickerOverridenStyles;

export class MaterialTimePicker extends Component {

	render() {
		const { required, format, hintText, floatingLabelText, value, fullWidth } = this.props;
		return (
			<MuiThemeProvider theme={muiTheme} >
    		<TimePicker
          required={required}
          format={format}
          hintText={hintText}
          floatingLabelText={floatingLabelText}
          value={value}
          onChange={this.props.onChange}
          fullWidth={fullWidth}
          TextFieldComponent={(props)=> {
          return (
                  <TextField
                      id="key"
                      label={hintText}
                      margin="dense"
                      {...this.props}
                      {...props}
                  />
              )
          }}
      />
			</MuiThemeProvider>
		)
	}
}
