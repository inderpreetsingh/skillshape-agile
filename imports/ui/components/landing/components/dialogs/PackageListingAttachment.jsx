import React from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import { MuiThemeProvider } from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;


const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
    dialogAction: {
        width: '100%'
    }
}

const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;

class PackageListingAttachment extends React.Component {
    
    render() {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Package Listing"
                    open={this.props.open}
                    onClose={this.props.onModalClose}
                    onRequestClose={this.props.onModalClose}
                    aria-labelledby="Package Listing"
                >
                    {this.props.isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                            Connect To Packages
    
                            <IconButton color="primary" onClick={()=>{this.props.onClose()}}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                        
                        </DialogContent>
                    <DialogActions classes={{ action: this.props.classes.dialogAction }}>
                       
                        <ClassTimeButton
                            fullWidth
                            noMarginBottom
                            label="Connect"
                            onClick={() => {this.props.onClose() }}
                        />
                    </DialogActions>

                </Dialog>
            </MuiThemeProvider>
        )
    }
}


export default withStyles(styles)(PackageListingAttachment);
