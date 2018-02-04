import React  from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '../jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  classTimeButton: {
    fontFamily: helpers.specialFont,
    fontSize: 14,
    padding: '0 16px',
    backgroundColor: helpers.primaryColor,
    height: 32,
    minHeight: 'auto',
    marginRight: helpers.rhythmDiv,
    '&:hover': {
      backgroundColor: helpers.primaryColor,
    },

    '@media screen and (max-width: 800px)': {
      fontSize: 12
    }
  },
  classTimeSecondaryButton: {
    fontSize: 14,
    padding: '0 16px',
    height: 32,
    minHeight: 'auto',
    fontFamily: helpers.specialFont,
    backgroundColor: helpers.panelColor,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: helpers.lightTextColor,
    },
  },
  classTimeButtonGhost: {
    border: `2px solid ${helpers.cancel}`,
    borderColor: helpers.cancel,
    backgroundColor: 'transparent',
    transition: 'all 0.3s linear',
    '&:hover': {
      backgroundColor: helpers.cancel,
    },
    '&:hover > span': {
      color: helpers.lightTextColor,
    },
  },
  classTimeButtonLabel: {
    color: helpers.lightTextColor,
    textTransform: 'none',
  },
  classTimeSecondaryButtonLabel: {
    color: helpers.textColor,
    textTransform: 'none',
  },
  classTimeButtonGhostLabel: {
    color: helpers.cancel,
    textTransform: 'none',
    '&:hover': {
      color: helpers.lightTextColor,
    },
  },
  fullWidth: {
    width: '100%'
  },
  noMarginBottom: {
    marginBottom: 0
  },
  classTimeButtonIcon: {
    display: 'inline-block',
    marginRight: '5px',
    fontSize: 'inherit'
  },
  classTimeButtonCustomIcon: {
    display: 'inline-block',
    fontSize: 'inherit'
  },
  ['@media (max-width:'+helpers.mobile+'px)']: {
    classTimeButton: {
      width: '100%'
    }
  }
};

const getIconForButton = (props) => {
  const CustomIcon = props.customIcon;
  if(CustomIcon && props.icon) {
    return <CustomIcon className={props.classes.classTimeButtonCustomIcon} />
  }else if (props.icon) {
    return <Icon className={props.classes.classTimeButtonIcon}>{props.iconName}</Icon>
  }

  return '';
}

const ClassTimeButton = (props) => {
  let rootClass = ``;
  let labelClass = props.classes.classTimeButtonLabel;
  // console.log(CustomIcon,"Custom Icon")
  if(props.fullWidth && props.noMarginBottom) {
    rootClass = `${props.classes.classTimeButton} ${props.classes.fullWidth} ${props.classes.noMarginBottom}`;
  }else if(props.fullWidth) {
    rootClass = `${props.classes.classTimeButton} ${props.classes.fullWidth}`;
  }else if(props.noMarginBottom) {
    rootClass = `${props.classes.classTimeButton} ${props.classes.noMarginBottom}`;
  }
  else{
    rootClass = props.classes.classTimeButton;
  }

  if(props.ghost) {
    rootClass = rootClass +' '+ props.classes.classTimeButtonGhost;
    labelClass = props.classes.classTimeButtonGhostLabel;
  }

  if(props.secondary) {
    rootClass = rootClass +' '+ props.classes.classTimeSecondaryButton;
    labelClass = props.classes.classTimeSecondaryButton;
  }

  if(props.itemScope && props.itemType) {
    return(<Button
      classes={{
        root: rootClass,
        label: labelClass
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
        label: labelClass
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

ClassTimeButton.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.bool,
    customIcon: PropTypes.element,
    iconName: PropTypes.string,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    noMarginBottom: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    itemScope: PropTypes.string,
    itemType: PropTypes.string
}

export default withStyles(styles)(ClassTimeButton);
