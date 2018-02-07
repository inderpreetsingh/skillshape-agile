import React, { Component } from 'react';
import { DateTimePicker } from 'material-ui-pickers';

export class MaterialDateTimePicker extends Component {

    render() {
        const { required, hintText, floatingLabelText, value, fullWidth } = this.props;
        return (
            <DateTimePicker
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