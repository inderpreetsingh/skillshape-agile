import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';

import * as helpers from '../jss/helpers.js';

const styles = {
  menuButtonIcon: {
    color: helpers.focalColor
  },
}

const MenuIconButton = (props) => (
  <IconButton onClick={props.handleClick}>
    <Icon className={props.classes.menuButtonIcon}>menu</Icon>
  </IconButton>
);

MenuIconButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MenuIconButton);