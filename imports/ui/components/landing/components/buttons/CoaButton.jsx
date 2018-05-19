import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  coaButton: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize * 1.5,
    backgroundColor:helpers.focalColor,
    transition: `box-shadow .2s linear`,
    '&:hover': {
      backgroundColor: helpers.focalColor,
      boxShadow: `2px 2px 4px ${helpers.shadowColor}`
    },
  },
  coaButtonLabel: {
    color: helpers.lightTextColor,
    textTransform: 'none',
  },
  coaButtonIcon:{
    display: 'inline-block',
    marginRight: '8px'
  }
};

const CoaButton = (props) => {
    if(props.itemScope && props.itemType) {
      <Button classes={{
          root: props.classes.coaButton,
          label: props.classes.coaButtonLabel,
        }} color="contrast" onClick={props.onClick}
        itemScope
        itemProps={props.findAction}
        >
        <Icon className={props.classes.coaButtonIcon}>{props.icon ? props.icon : 'face'} </Icon>
        {props.label ? props.label : 'Submit'}
      </Button>
    }

    return(
      <Button classes={{
          root: props.classes.coaButton,
          label: props.classes.coaButtonLabel,
        }} color="contrast" onClick={props.onClick}>
        <Icon className={props.classes.coaButtonIcon}>{props.icon ? props.icon : 'face'} </Icon>
        {props.label ? props.label : 'Submit'}
      </Button>
    )
}

CoaButton.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  label:PropTypes.string,
  icon:PropTypes.string,
  itemScope: PropTypes.bool,
  itemType: PropTypes.string,
  onClick: PropTypes.func
};

export default withStyles(styles)(CoaButton);
