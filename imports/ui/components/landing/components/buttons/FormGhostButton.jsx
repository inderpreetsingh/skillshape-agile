import React  from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '../jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  formGhostButton: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor:"transparent",
    border:"1px solid",
    borderColor: helpers.primaryColor,
    color:helpers.primaryColor,
    textTransform:"none",
  },
  fullWidth: {
    width: '100%'
  },
  buttonIcon: {
    display: 'inline-block',
    marginRight: '5px' 
  }
};


const FormGhostButton = (props) => {
  let rootClass = ``;
  if(props.fullWidth) {
    rootClass = `${props.classes.formGhostButton} ${props.classes.fullWidth}`;  
  }else{
    rootClass = props.classes.formGhostButton;
  }

  return (
    <Button classes={{
      root: rootClass,
      }} onClick={props.onClick}>
        {props.icon && <Icon className={props.classes.buttonIcon}>{props.iconName}</Icon>}
        
        {props.label ? props.label : 'Submit'}
    </Button>
  )
}

FormGhostButton.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.bool,
    iconName: PropTypes.string,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    classes: PropTypes.object.isRequired
}
        
export default withStyles(styles)(FormGhostButton);


