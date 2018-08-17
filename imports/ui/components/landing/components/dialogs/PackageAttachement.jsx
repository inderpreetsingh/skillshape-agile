import React from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider } from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import PackageListingAttachment from './PackageListingAttachment';
import PackageAddNew from './PackageAddNew';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
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
    constructor(props) {
        super(props);
        this.state = { PackageListingAttachment: false, pacLisAttOpen: true, PackageAddNew: false }
    }
    render() {
        const { schoolId, classTypeId, classTypeName, parentData, closed } = this.props;

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

                            <IconButton color="primary" onClick={() => { this.props.onClose() }}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent style={{ fontSize: '18px' }}>
                        {closed ? 'You have created a Closed Series/Set. Often, their is an enrollment fee for a closed series.'
                            : 'Would you like to connect class package to this class type.'
                        }

                    </DialogContent>
                    <DialogActions classes={{ action: this.props.classes.dialogAction }}>
                        {/* <ClassTimeButton
                            fullWidth
                            label="Create New Package"
                            noMarginBottom
                            onClick={() => {this.setState({PackageAddNew:true}) }
                            }
                        />
                        <ClassTimeButton
                            fullWidth
                            noMarginBottom
                            label="Linked Existing Packages"
                            onClick={(e) => { this.setState({ PackageListingAttachment: true }) }}
                            bgColor={'rgb(38, 123, 195)'}
                        />
                        <ClassTimeButton
                            fullWidth
                            noMarginBottom
                            label="No thanks"
                            onClick={() => { this.props.classTimeFormOnClose() }}
                            bgColor={'rgb(186, 195, 38)'}
                        /> */}
                        <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ButtonWrapper>
                            <FormGhostButton
                                onClick={() => { this.setState({ PackageAddNew: true }) }}
                                label="Create New Package"
                            />
                        </ButtonWrapper>
                        <ButtonWrapper>
                            <FormGhostButton
                                onClick={(e) => { this.setState({ PackageListingAttachment: true }) }}
                                label="Linked Existing Packages"
                            />
                        </ButtonWrapper>
                        <ButtonWrapper>
                            <FormGhostButton
                                darkGreyColor
                                onClick={() => { this.props.classTimeFormOnClose() }}
                                label="No thanks"
                            />
                        </ButtonWrapper>
                        </Grid>
                    </DialogActions>

                </Dialog>
                {this.state.PackageListingAttachment && <PackageListingAttachment
                    open={this.state.pacLisAttOpen}
                    onClose={() => { this.setState({ PackageListingAttachment: false }) }}
                    schoolId={schoolId}
                    classTypeId={classTypeId}
                    classTimeFormOnClose={() => { this.props.classTimeFormOnClose() }}
                />}
                {this.state.PackageAddNew && <PackageAddNew
                    open={this.state.PackageAddNew}
                    onClose={() => { this.setState({ PackageAddNew: false }) }}
                    schoolId={schoolId}
                    classTypeId={classTypeId}
                    classTimeFormOnClose={() => { this.props.classTimeFormOnClose() }}
                    classTypeName={classTypeName}
                    parentData={parentData}
                />}
            </MuiThemeProvider>
        )
    }
}


export default withStyles(styles)(PackageAttachment);
