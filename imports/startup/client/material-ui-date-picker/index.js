import React, { Component } from 'react';
import { DatePicker } from 'material-ui-pickers';
import TextField from 'material-ui/TextField';


export class MaterialDatePicker extends Component {

	render() {
		const {
            required,
            hintText,
            floatingLabelText,
            value,
            emptyLabel,
            fullWidth
        } = this.props;
		return (
    		<DatePicker
                required={required}
                hintText={hintText}
                floatingLabelText={floatingLabelText}
                value={value}
                emptyLabel={emptyLabel || ""}
                onChange={this.props.onChange}
                fullWidth={fullWidth}
                TextFieldComponent={(props)=> {
                return (
                        <TextField
                            id="key"
                            label={hintText}
                            margin="normal"
                            {...this.props}
                            {...props}
                        />
                    )
                }}
            />
		)
	}
}