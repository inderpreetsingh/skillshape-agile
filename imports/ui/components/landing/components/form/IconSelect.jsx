import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import Select from 'material-ui/Select';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import * as helpers from '../jss/helpers';

const IconSelect = (props) => (
    <div>
        <FormControl fullWidth>
              <InputLabel htmlFor={props.inputId}>{props.labelText}</InputLabel>
              <Select
                autoWidth
                value={''}
                onChange={props.onChange}
                input={<Input 
                          name={props.inputId}
                            id={props.inputId} 
                          endAdornment={
                              <InputAdornment position="end">
                                <Icon color="disabled">{props.iconName}</Icon>
                               </InputAdornment>
                          }/>
                  
                }>
                {props.children}
              </Select>
        </FormControl>
    </div>
);

IconSelect.propTypes = {
    iconName: PropTypes.string.isRequired,
    placeHolder: PropTypes.string,
    labelText: PropTypes.string,
    onChange: PropTypes.func,
    inputId: PropTypes.string,
    children: PropTypes.element,
}

export default IconSelect;