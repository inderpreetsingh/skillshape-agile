import React  from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

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
  noMarginBottom: {
    marginBottom: 0
  },
  secondaryButtonIcon: {
    display: 'inline-block',
    marginRight: '5px',
    fontSize: 'inherit'
  },
  searchBarHeight: {
    height: 48
  },
  searchBarShadow: {
    boxShadow: `2px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14) , 0px 3px 1px -2px rgba(0, 0, 0, 0.12)`
  },
   ['@media (max-width:'+helpers.mobile+'px)']: {
    secondaryButton: {
      width: '100%'
    }
  },
  noMinWidth: {
    minWidth: 0
  }
};

const getLabel = (props) => {
  if(props.noLabel) {
    return ''
  }
  return props.label ? props.label : 'Submit';
}


const SecondaryButton = (props) => {
  let rootClass = ``;
  if(props.fullWidth && props.noMarginBottom) {
    rootClass = `${props.classes.secondaryButton} ${props.classes.fullWidth} ${props.classes.noMarginBottom}`;
  }else if(props.fullWidth) {
    rootClass = `${props.classes.secondaryButton} ${props.classes.fullWidth}`;
  }else if(props.noMarginBottom) {
    rootClass = `${props.classes.secondaryButton} ${props.classes.noMarginBottom}`;
  }
  else{
    rootClass = props.classes.secondaryButton;
  }

  if(props.increaseHeight) {
    rootClass = rootClass + ' ' + props.classes.searchBarHeight;
  }

  if(props.boxShadow) {
    rootClass = rootClass + ' ' + props.classes.searchBarShadow;
  }

  if(props.noLabel) {
    rootClass = rootClass + ' ' + props.classes.noMinWidth;
  }

  if(props.itemScope && props.itemType) {
    return (
      <Button classes={{
        root: rootClass,
        label: props.classes.secondaryButtonLabel
        }}
        onClick={props.onClick}
        itemScope
        itemType={props.itemType}
        >
          {props.icon && <Icon className={props.classes.secondaryButtonIcon}>{props.iconName}</Icon>}

          {getLabel(props)}
      </Button>
    )
  }
  return (

    <Button classes={{
      root: rootClass,
      label: props.classes.secondaryButtonLabel
      }} onClick={props.onClick}>
        {props.icon && <Icon className={props.classes.secondaryButtonIcon}>{props.iconName}</Icon>}

        {getLabel(props)}
    </Button>
  )
}

SecondaryButton.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.bool,
    iconName: PropTypes.string,
    label: PropTypes.string,
    fullWidth: PropTypes.bool,
    noMarginBottom: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    itemScope: PropTypes.string,
    itemProp: PropTypes.string,
    noLabel: PropTypes.bool
}

SecondaryButton.defaultProps = {
  noLabel: false
}

export default withStyles(styles)(SecondaryButton);
