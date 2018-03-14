import React  from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '../jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  memberActionButton: {
    fontFamily: helpers.specialFont,
    fontSize: 14,
    padding: '0 16px',
    backgroundColor: helpers.primaryColor,
    height: 32,
    minHeight: 'auto',
    lineHeight: 1,
    marginRight: helpers.rhythmDiv,
    '&:hover': {
      backgroundColor: helpers.primaryColor,
    },

    '@media screen and (max-width: 800px)': {
      fontSize: 12
    }
  },
  memberActionSecondaryButton: {
    fontSize: 14,
    padding: '0 16px',
    height: 32,
    minHeight: 'auto',
    fontFamily: helpers.specialFont,
    backgroundColor: helpers.communication,
    textTransform: 'none',
    lineHeight: 1
  },
  memberActionButtonGhost: {
    border: `2px solid ${helpers.cancel}`,
    borderColor: helpers.cancel,
    backgroundColor: 'transparent',
    transition: 'all 0.3s linear',
    lineHeight: 1,
    '&:hover': {
      backgroundColor: helpers.cancel,
    },
    '&:hover > span': {
      color: helpers.lightTextColor,
    },
  },
  MemberActionButtonLabel: {
    color: helpers.lightTextColor,
    lineHeight: 1,
    textTransform: 'none',
  },
  memberActionSecondaryButtonLabel: {
    color: '#fff',
    lineHeight: 1,
    textTransform: 'none',
  },
  memberActionButtonGhostLabel: {
    color: helpers.cancel,
    lineHeight: 1,
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
  memberActionButtonIcon: {
    display: 'inline-block',
    marginRight: '5px',
    fontSize: 'inherit'
  },
  memberActionButtonCustomIcon: {
    display: 'inline-block',
    fontSize: 'inherit'
  },
  ['@media (max-width:'+helpers.mobile+'px)']: {
    memberActionButton: {
      width: '100%'
    }
  }
};

const getIconForButton = (props) => {
  const CustomIcon = props.customIcon;
  if(CustomIcon && props.icon) {
    return <CustomIcon className={props.classes.memberActionButtonCustomIcon} />
  }else if (props.icon) {
    return <Icon className={props.classes.memberActionButtonIcon}>{props.iconName}</Icon>
  }

  return '';
}

const MemberActionButton = (props) => {
  let rootClass = ``;
  let labelClass = props.classes.memberActionButtonLabel;
  // console.log(CustomIcon,"Custom Icon")
  if(props.fullWidth && props.noMarginBottom) {
    rootClass = `${props.classes.memberActionButton} ${props.classes.fullWidth} ${props.classes.noMarginBottom}`;
  }else if(props.fullWidth) {
    rootClass = `${props.classes.memberActionButton} ${props.classes.fullWidth}`;
  }else if(props.noMarginBottom) {
    rootClass = `${props.classes.memberActionButton} ${props.classes.noMarginBottom}`;
  }
  else{
    rootClass = props.classes.memberActionButton;
  }

  if(props.ghost) {
    rootClass = rootClass +' '+ props.classes.memberActionButtonGhost;
    labelClass = props.classes.memberActionButtonGhostLabel;
  }

  if(props.secondary) {
    rootClass = rootClass +' '+ props.classes.memberActionSecondaryButton;
    labelClass = props.classes.memberActionSecondaryButtonLabel;
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

MemberActionButton.propTypes = {
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

export default withStyles(styles)(MemberActionButton);
