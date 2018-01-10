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
      let autocomplete = new google.maps.places.Autocomplete(inputRef,options);
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        let coords = {};
        coords.NEPoint = [place.geometry.viewport.b.b, place.geometry.viewport.b.f];
        coords.SWPoint = [place.geometry.viewport.f.b,place.geometry.viewport.f.f];
        // coords[1] = place.geometry['location'].lng();
        props.onLocationChange({name: place.name, coords })
      })
    },2000)
  }

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={props.inputId}>{props.labelText}</InputLabel>
      <Input
        inputRef={(ref)=> inputRef = ref}
        type={props.type}
        defaultValue={props.defaultValue}
        id={props.inputId}
        onChange={props.onChange}
        endAdornment={<InputAdornment position="end"><InputIcon iconName={props.iconName}/></InputAdornment>}
      />
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
  googlelocation:PropTypes.boolean
}

IconInput.defaultProps = {
  type: 'text'
}
export default IconInput;