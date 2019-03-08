import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withPopUp } from '/imports/util';
import TextField from "material-ui/TextField";
import { gotoClaimSchool, confirmationDialog } from '/imports/util';
import { browserHistory } from "react-router";
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;
const CenterAll = styled.div`
  display: flex;
  justify-content: center;
`;
const ButtonWrapper= styled.div`
    min-width: 166px
`;
const styles = {
    dialogAction: {
        width: '100%'
    },
    textField: {
        marginBottom: helpers.rhythmDiv
    }
}

class PrivacySettingsDialogBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { classes, schoolName = 'School',onModalClose,open } = this.props;
        const { isLoading } = this.state;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Privacy Settings"
                    open={open}
                    onClose={onModalClose}
                    onRequestClose={onModalClose}
                    aria-labelledby="Privacy Settings"
                >
                    {isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                            Privacy Settings For {schoolName}
                            <IconButton color="primary" onClick={onModalClose}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions classes={{ action: this.props.classes.dialogAction }}>
                        <CenterAll>
                            <ButtonWrapper>
                                <FormGhostButton
                                    alertColor
                                    fullWidth
                                    onClick={onModalClose}
                                    label={"Close"}
                                />
                            </ButtonWrapper>
                            <ButtonWrapper>
                                <FormGhostButton
                                    fullWidth
                                    onClick={() => { }}
                                    label={"Save"}
                                />
                            </ButtonWrapper>
                        </CenterAll>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

PrivacySettingsDialogBox.propTypes = {
    memberId: PropTypes.string,
    schoolName: PropTypes.string,
    open: PropTypes.bool,
    onModalClose: PropTypes.func
}
export default (withStyles(styles)(withPopUp(PrivacySettingsDialogBox)));
