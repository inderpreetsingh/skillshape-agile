import React, { Component } from 'react';
import { DatePicker } from 'material-ui-pickers';

export class MaterialDatePicker extends Component {

	render() {
		const { required, hintText, floatingLabelText, value, fullWidth } = this.props;
		return (
    		<DatePicker
                required={required}
                hintText={hintText}
                floatingLabelText={floatingLabelText}
                value={value}
                onChange={this.props.onChange}
                fullWidth={fullWidth}
            />
		)
	}
}