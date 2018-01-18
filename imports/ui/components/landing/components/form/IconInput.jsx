import React from 'react';
import PropTypes from 'prop-types';

import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import * as helpers from '../jss/helpers.js';


const InputIcon = (props) => (<Icon color="disabled">{props.iconName}</Icon>);


const IconInput = (props) => {
  let inputRef;
  if(props.googlelocation) {
    setTimeout(()=> {
      let options ={strictBounds:true}
      // Google's API
      let autocomplete = new google.maps.places.Autocomplete(inputRef,options);
      // This runs when user changes location.
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        let coords = [];
        coords[0] = place.geometry['location'].lat();
        coords[1] =place.geometry['location'].lng();;
        props.onLocationChange({name: place.name, coords })
      })
    },2000)
  }

  return (
    <FormControl error={props.error} fullWidth aria-describedby="error-text">
      <InputLabel htmlFor={props.inputId}>{props.labelText}</InputLabel>
      <Input
        inputRef={(ref)=> inputRef = ref}
        type={props.type}
        defaultValue={props.defaultValue}
        id={props.inputId}
        onChange={props.onChange}
        endAdornment={<InputAdornment position="end"><InputIcon iconName={props.iconName}/></InputAdornment>}
      />
      {
        props.error && <FormHelperText id="error-text">{props.errorText}</FormHelperText>
      }
    </FormControl>
  )
};


IconInput.propTypes = {
  iconName: PropTypes.string.isRequired,
  type: PropTypes.string,
  defaultValue: PropTypes.string,
  inputId: PropTypes.string,
  placeHolder: PropTypes.string,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  googlelocation: PropTypes.boolean,
  error: PropTypes.boolean,
  errorText: PropTypes.string,
}

IconInput.defaultProps = {
  type: 'text'
}
export default IconInput;