import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import HighlightOff from 'material-ui-icons/HighlightOff';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import { MuiThemeProvider} from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const DialogRelativeWrapper = styled.div`
    position:relative;
    overflow-x:hidden;
`;

const DialogCloseButton = styled.div`
    position:absolute;
    top:-8px;
    right:-8px;
`;


class GeneralDialogWrapper extends Component {
    state = {
        dialogOpen: false,
    }
    toggleDialogBoxState = () => {
        this.setState({
            dialogOpen : !this.state.dialogOpen
        })
    }
    handleDialogBoxState = (state) => {
        this.setState({
            dialogOpen: state
        })
    }  
    render() {
        return(
            <div>
                {this.state.dialogOpen && 
                <Dialog open={this.state.dialogOpen} 
                    onClose={this.props.onModalClose}
                    onRequestClose={this.props.onModalClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogRelativeWrapper>
                        <DialogCloseButton>
                            <IconButton color="primary" onClick={this.toggleDialogBoxState}>
                                <HighlightOff/> 
                            </IconButton > 
                        </DialogCloseButton>
                        
                        <DialogTitle>
                            {this.props.title}
                        </DialogTitle>
                        {this.props.children}
                    </DialogRelativeWrapper>
                </Dialog>}
                {this.props.openTrigger}
            </div>
        )
    }
}

export default GeneralDialogWrapper;