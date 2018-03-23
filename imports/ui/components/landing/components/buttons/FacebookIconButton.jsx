import React from 'react';
import PropTypes from 'prop-types';
import { SocialIcon } from 'react-social-icons';

import Button from 'material-ui/Button';
import {withStyles} from 'material-ui/styles';

import * as helpers from '../jss/helpers.js';

const iconStyles = {
    height: 25,
    width : 25,
    overflow: 'visible',
    margin: `0 ${helpers.rhythmDiv * 2}px`
}

const facebookButtonColor = helpers.facebookButtonColor;

const styles = {
    facebookButton: {
        background: facebookButtonColor,
        width: '100%',
        padding: '8px 0',
        textAlign: 'left',

        '&:hover': {
            background: facebookButtonColor
        }
    },
    label: {
        textTransform: 'none',
        color: helpers.lightTextColor,
        display: 'block'
    },
    textCenter: {
      textAlign: 'center'
    }
}

const FacebookIconButton = (props) => {
  let rootClass = '';
  if(props.textCenter) {
    rootClass = `${props.classes.facebookButton} ${props.classes.textCenter}`;
  }else {
    rootClass = props.classes.facebookButton;
  }

  return(
    <Button color={facebookButtonColor} onClick={props.onClick} classes={{root: rootClass, label: props.classes.label}}>
      <SocialIcon network="facebook" style={iconStyles} color={helpers.lightTextColor}/>
      {props.label}
    </Button>
  )
}

FacebookIconButton.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string,
    textCenter: PropTypes.bool
}

FacebookIconButton.defaultProps = {
    label: 'Sign Up With Facebook'
}

export default withStyles(styles)(FacebookIconButton);
