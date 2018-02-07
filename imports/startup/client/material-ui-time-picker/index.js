import React, { Component } from 'react';
import { TimePicker } from 'material-ui-pickers'

export class MaterialTimePicker extends Component {

	render() {
		const { required, format, hintText, floatingLabelText, value, fullWidth } = this.props;
		return (
    		<TimePicker
                required={required}
                format={format}
                hintText={hintText}
                floatingLabelText={floatingLabelText}
                value={value}
                onChange={this.props.onChange}
                fullWidth={fullWidth}
            />
		)
	}
}