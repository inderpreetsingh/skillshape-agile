import React from 'react';
import PropTypes from 'prop-types';

import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import * as helpers from '../jss/helpers.js';


const InputIcon = (props) => (<Icon color="disabled">{props.iconName}</Icon>);


const IconInput = (props) => (
    <FormControl fullWidth>
      <InputLabel htmlFor={props.inputId}>{props.labelText}</InputLabel>
      <Input
        type={props.type}
        id={props.inputId}
        onChange={props.onChange}
        endAdornment={<InputAdornment position="end"><InputIcon iconName={props.iconName}/></InputAdornment>}
      />
    </FormControl>
);


IconInput.propTypes = {
  iconName: PropTypes.string.isRequired,
  type: PropTypes.string,
  inputId: PropTypes.string,
  placeHolder: PropTypes.string,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
}

IconInput.defaultProps = {
  type: 'text'
}
export default IconInput;