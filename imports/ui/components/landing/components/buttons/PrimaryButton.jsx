import React  from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '../jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  primaryButton: {
    marginRight:helpers.rhythmDiv,
    marginBottom:helpers.rhythmDiv,
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor:helpers.primaryColor,
    '&:hover': {
      backgroundColor: helpers.primaryColor,
    },
  },
  primaryButtonLabel: {
    color: helpers.lightTextColor,
    textTransform: 'none',
  },
  fullWidth: {
    width: '100%'
  },
  primaryButtonIcon: {
    display: 'inline-block',
    marginRight: '5px',
    fontSize: 'inherit'
  },
  ['@media (max-width:'+helpers.mobile+'px)']: {
    primaryButton: {
      width: '100%'
    }
  }
};


const PrimaryButton = (props) => {
  let rootClass = ``;
  if(props.fullWidth) {
    rootClass = `${props.classes.primaryButton} ${props.classes.fullWidth}`;
  }else{
    rootClass = props.classes.primaryButton;
  }

  return (
    <Button
      classes={{
        root: rootClass,
        label: props.classes.primaryButtonLabel
      }}
      onClick={props.onClick}
      disabled={props.disabled}
    >
        {props.icon && <Icon className={props.classes.primaryButtonIcon}>{props.iconName}</Icon>}

        {props.label ? props.label : 'Submit'}
    </Button>
  )
}

PrimaryButton.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.bool,
    iconName: PropTypes.string,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
}

export default withStyles(styles)(PrimaryButton);


