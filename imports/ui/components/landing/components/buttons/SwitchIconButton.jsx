import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import * as helpers from '../jss/helpers.js';

const styles = {
    switchButton: {
        padding: helpers.rhythmDiv * 2,
        margin: helpers.rhythmDiv * 2,
        backgroundColor: helpers.focalColor,
        color: helpers.panelColor,
        transition:"1s all ease",
        '&:hover': {
            backgroundColor: helpers.primaryColor
        }
    }
};

class SwitchIconButton extends Component {
    state = {
        startIcon : true,
    } 
    handleToggleStartIconState = () => {
        this.setState({
            startIcon : !this.state.startIcon
        })
        
        if(this.props.onClick)
            this.props.onClick();
    }
    render() {
        const { classes, startIconName, endIconName} = this.props;
        const { startIcon } = this.state;
        return (
            <Button fab className={classes.switchButton} onClick={this.handleToggleStartIconState} >
                <Icon>{startIcon ? startIconName : endIconName}</Icon>
            </Button>    
        )       
    }
    
}

SwitchIconButton.propTypes = {
    startIconName : PropTypes.string.isRequired,
    endIconName: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func
}

SwitchIconButton.defaultProps = {
    startIconName: 'map',
    endIconName : 'grid_on'
}

export default withStyles(styles)(SwitchIconButton);