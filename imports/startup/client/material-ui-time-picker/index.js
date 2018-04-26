import React, { Component } from 'react';

import { TimePicker } from 'material-ui-pickers'
import TextField from 'material-ui/TextField';

export class MaterialTimePicker extends Component {

	render() {
		const { required, format, hintText, floatingLabelText, value, fullWidth } = this.props;
		return (<TimePicker
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
      />)
	}
}
