import React  from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '../jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  secondaryButton: {
    marginRight:helpers.rhythmDiv,
    marginBottom:helpers.rhythmDiv,
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor: helpers.panelColor,
    '&:hover': {
      backgroundColor: helpers.lightTextColor,
    },
  },
  secondaryButtonLabel: {
    color: helpers.textColor,
    textTransform: 'none',
  },
  fullWidth: {
    width: '100%'
  },
  secondaryButtonIcon: {
    display: 'inline-block',
    marginRight: '5px',
    fontSize: 'inherit'
  },
   ['@media (max-width:'+helpers.mobile+'px)']: {
    secondaryButton: {
      width: '100%'
    }
  }
};


const SecondaryButton = (props) => {
  let rootClass = ``;
  if(props.fullWidth) {
    rootClass = `${props.classes.secondaryButton} ${props.classes.fullWidth}`;  
  }else{
    rootClass = props.classes.secondaryButton;
  }

  return (
    <Button classes={{
      root: rootClass,
      label: props.classes.secondaryButtonLabel
      }} onClick={props.onClick}>
        {props.icon && <Icon className={props.classes.secondaryButtonIcon}>{props.iconName}</Icon>}
        
        {props.label ? props.label : 'Submit'}
    </Button>
  )
}

SecondaryButton.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.bool,
    iconName: PropTypes.string,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    classes: PropTypes.object.isRequired
}
        
export default withStyles(styles)(SecondaryButton);


