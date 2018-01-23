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

const googleButtonColor = helpers.googleButtonColor;

const styles = {
    googleButton: {
        background: googleButtonColor,
        width: '100%',
        padding: '8px 0',
        textAlign: 'left',

        '&:hover': {
            background: googleButtonColor
        }
    },
    label: {
        textTransform: 'none',
        color: helpers.lightTextColor,
        display: 'block'
    }
}

const GoogleIconButton = (props) => (
    <Button color={googleButtonColor} onClick={props.onClick} classes={{root: props.classes.googleButton, label: props.classes.label}}>
        <SocialIcon network="google" style={iconStyles} color={helpers.lightTextColor}/>
        {props.label}
    </Button>
);

GoogleIconButton.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string
}

GoogleIconButton.defaultProps = {
    label: 'Sign Up With Google'
}

export default withStyles(styles)(GoogleIconButton);
