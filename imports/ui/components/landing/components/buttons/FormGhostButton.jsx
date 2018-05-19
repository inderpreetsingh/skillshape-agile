import React  from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  formGhostButton: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor: "transparent",
    border: "1px solid",
    borderColor: helpers.primaryColor,
    color: helpers.primaryColor,
    textTransform: "none",
    '&:hover': {
      backgroundColor: helpers.primaryColor,
      color: 'white'
    }
  },
  fullWidth: {
    width: '100%'
  },
  buttonIcon: {
    display: 'inline-block',
    marginRight: '5px',
    fontSize: helpers.baseFontSize
  },
  blackColor: {
    color: helpers.black,
    borderColor: helpers.black,
    '&:hover': {
      backgroundColor: helpers.black,
      color: 'white'
    }
  },
  greyColor: {
    color: helpers.cancel,
    borderColor: helpers.cancel,
    '&:hover': {
      backgroundColor: helpers.cancel,
      color: 'white'
    }
  },
  darkGreyColor: {
    color: helpers.darkBgColor,
    borderColor: helpers.darkBgColor,
    '&:hover': {
      backgroundColor: helpers.darkBgColor,
      color: 'white'
    }
  }
};


const FormGhostButton = (props) => {
  let rootClass = ``;
  if(props.fullWidth) {
    rootClass = `${props.classes.formGhostButton} ${props.classes.fullWidth}`;
  }else{
    rootClass = props.classes.formGhostButton;
  }

  if(props.blackColor) {
    rootClass = rootClass + ' ' + props.classes.blackColor;
  }
  else if(props.greyColor) {
    rootClass = rootClass + ' ' + props.classes.greyColor;
  }
  else if(props.darkGreyColor) {
    rootClass = rootClass + ' ' + props.classes.darkGreyColor;
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
