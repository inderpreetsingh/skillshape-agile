import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import * as helpers from '../jss/helpers.js';
import { findDOMNode } from 'react-dom'

const InputIcon = (props) => (<Icon color="disabled">{props.iconName}</Icon>);


class IconInput extends React.Component {
  state = { inputFocused : false}
  onFocus = ()=> {
      this.setState({inputFocused: true})
  }
  onBlur = ()=> {
      this.setState({inputFocused: false})
  }
  render() {
    const props = this.props;
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
      <Fragment>
      {!props.skillShapeInput ? <FormControl error={props.error} fullWidth aria-describedby="error-text">
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
      </FormControl> : <FormControl error={props.error} fullWidth aria-describedby="error-text">
          <div className={this.state.inputFocused ? "rw-multiselect rw-widget rw-state-focus" : "rw-multiselect rw-widget"}>
            <div tabindex="0"  className="rw-widget-input rw-widget-picker rw-widget-container">
              <div style={{display: 'inline-flex', alignItems: 'center', paddingRight: 10}}>
                <input
                  ref={(ref)=> inputRef = ref}
                  type={props.type}
                  defaultValue={props.defaultValue}
                  id={props.inputId}
                  onChange={props.onChange}
                  placeholder={props.placeholder}
                  className="rw-input-reset"
                   style={{width: "100%"}}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                />
                <InputIcon iconName={props.iconName}/>
              </div>
            </div>
          </div>
      </FormControl>
      }
      </Fragment>
    )
  }
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