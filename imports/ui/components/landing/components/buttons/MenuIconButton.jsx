import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';

const styles = {
  menuButtonIcon: {
    color: helpers.focalColor,
  },
  menuButtonSmall: {
    height: 32,
    width: 32,
  },
};

const MenuIconButton = (props) => {
  const menuIconClassName = props.classes.menuIconButton;
  let menuButtonClassName = '';

  if (props.smallSize) {
    menuButtonClassName = `${menuButtonClassName} ${props.classes.menuButtonSmall}`;
  }

  return (
    <IconButton onClick={props.handleClick} className={menuButtonClassName}>
      <Icon className={menuIconClassName}>menu</Icon>
    </IconButton>
  );
};

MenuIconButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
};

MenuIconButton.defaultProps = {
  smallSize: false,
};

export default withStyles(styles)(MenuIconButton);
