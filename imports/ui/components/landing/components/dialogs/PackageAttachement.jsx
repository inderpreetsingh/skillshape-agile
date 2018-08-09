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
import PackageListingAttachment from './PackageListingAttachment';
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

class PackageAttachment extends React.Component {
    constructor(props){
        super(props);
       this.state={PackageListingAttachment:false,pacLisAttOpen:true}
    }
    render() {
    const { schoolId,classTypeId} = this.props;

        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Select Package"
                    open={this.props.open}
                    onClose={this.props.onModalClose}
                    onRequestClose={this.props.onModalClose}
                    aria-labelledby="Select Package"
                >
                    {this.props.isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                            Select Package
    
                            <IconButton color="primary" onClick={()=>{this.props.onClose()}}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                        You have created a Closed Series.Often, their is an enrollment fee for a closed series.
                        </DialogContent>
                    <DialogActions classes={{ action: this.props.classes.dialogAction }}>
                        <ClassTimeButton
                            fullWidth
                            label="Create New Package"
                            noMarginBottom
                            onClick={() => { }
                            }
                        />
                        <ClassTimeButton
                            fullWidth
                            noMarginBottom
                            label="Linked Existing Packages"
                            onClick={(e) => {this.setState({PackageListingAttachment:true})}
                            }
                        />
                        <ClassTimeButton
                            fullWidth
                            noMarginBottom
                            label="No thanks"
                            onClick={() => {this.props.onClose() }}
                        />
                    </DialogActions>

                </Dialog>
                {this.state.PackageListingAttachment && <PackageListingAttachment 
                open={this.state.pacLisAttOpen} 
                onClose={()=>{this.setState({PackageListingAttachment:false})}}
                schoolId={schoolId}
                classTypeId={classTypeId}
                />}
            </MuiThemeProvider>
        )
    }
}


export default withStyles(styles)(PackageAttachment);
