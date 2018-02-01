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
  noMarginBottom: {
    marginBottom: 0
  },
  primaryButtonIcon: {
    display: 'inline-block',
    marginRight: '5px',
    fontSize: 'inherit'
  },
  primaryButtonCustomIcon: {
    display: 'inline-block',
    fontSize: 'inherit'
  },
  searchBarHeight: {
    height: 48
  },
  ['@media (max-width:'+helpers.mobile+'px)']: {
    primaryButton: {
      width: '100%'
    }
  }
};

const getIconForButton = (props) => {
  const CustomIcon = props.customIcon;
  if(CustomIcon && props.icon) {
    return <CustomIcon className={props.classes.primaryButtonCustomIcon} />
  }else if (props.icon) {
    return <Icon className={props.classes.primaryButtonIcon}>{props.iconName}</Icon>
  }

  return '';
}

const PrimaryButton = (props) => {
  let rootClass = ``;
  // console.log(CustomIcon,"Custom Icon")
  if(props.fullWidth && props.noMarginBottom) {
    rootClass = `${props.classes.primaryButton} ${props.classes.fullWidth} ${props.classes.noMarginBottom}`;
  }else if(props.fullWidth) {
    rootClass = `${props.classes.primaryButton} ${props.classes.fullWidth}`;
  }else if(props.noMarginBottom) {
    rootClass = `${props.classes.primaryButton} ${props.classes.noMarginBottom}`;
  }
  else{
    rootClass = props.classes.primaryButton;
  }

  if(props.increaseHeight) {
    rootClass = rootClass + ' ' + props.classes.searchBarHeight;
  }

  if(props.itemScope && props.itemType) {
    return(<Button
      classes={{
        root: rootClass,
        label: props.classes.primaryButtonLabel
      }}
      onClick={props.onClick}
      disabled={props.disabled}
      itemScope
      itemType={props.itemType}
    >
        {getIconForButton(props)}

        {props.label ? props.label : 'Submit'}
      </Button>
    )
  }

  return (

    <Button
      classes={{
        root: rootClass,
        label: props.classes.primaryButtonLabel
      }}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
        {getIconForButton(props)}

        {props.label ? props.label : 'Submit'}
    </Button>
  )
}

PrimaryButton.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.bool,
    customIcon: PropTypes.element,
    iconName: PropTypes.string,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    noMarginBottom: PropTypes.bool,
    increaseHeight: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    itemScope: PropTypes.bool,
    itemType: PropTypes.string
}

export default withStyles(styles)(PrimaryButton);
