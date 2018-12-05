import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get } from 'lodash';
import { withStyles, MuiThemeProvider } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';

import ClearIcon from 'material-ui-icons/Clear';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { FormGhostButton, PrimaryButton } from '/imports/ui/components/landing/components/buttons/';

import { DialogBoxTitleBar } from './sharedDialogBoxComponents';
import { Text, SubHeading, Heading, ToggleVisibility } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, {
    DialogContent,
    DialogTitle,
    DialogActions,
    withMobileDialog
} from "material-ui/Dialog";

const styles = theme => {
    return {
        dialogTitleRoot: {
            padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
            marginBottom: `${helpers.rhythmDiv * 2}px`,
            '@media screen and (max-width : 500px)': {
                padding: `0 ${helpers.rhythmDiv * 3}px`
            }
        },
        dialogContent: {
            padding: `0 ${helpers.rhythmDiv * 3}px`,
            paddingBottom: helpers.rhythmDiv,
            flexShrink: 0,

        },
        dialogPaper: {
            maxWidth: 600,
            width: '100%',
            margin: helpers.rhythmDiv
        },
        dialogActionsRoot: {
            padding: `0 ${helpers.rhythmDiv}px`,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
        },
        dialogActions: {
            width: '100%',
            paddingLeft: `${helpers.rhythmDiv * 2}px`
        },
        iconButton: {
            height: "auto",
            width: "auto",
            position: 'absolute',
            right: helpers.rhythmDiv * 2,
            top: helpers.rhythmDiv * 2
        },
    };
};

const ContentWrapper = styled.div`
  width: 100%;
`;

const Title = SubHeading.extend`
    font-style: italic;
    text-align: center;
    font-weight: 300;
`;


const SubscriptionsDetailsDialogBox = () => {
    const {
        classes,
        onModalClose,
        schoolName,
        studentName,
        selectedSchool,
        subscriptionsData,
        open,
    } = props;
    return (
        <Dialog
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby="contact us"
            classes={{ paper: classes.dialogPaper }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                    <DialogBoxTitleBar
                        title={"Manage Membership"}
                        onModalClose={onModalClose}
                        classes={classes}
                    />
                </DialogTitle>

                <DialogContent classes={{ root: classes.dialogContent }}>
                    <Title>Details for packages</Title>
                    <ContentWrapper>
                        here are the package details.
                    </ContentWrapper>
                </DialogContent>

                <DialogActions
                    classes={{
                        root: classes.dialogActionsRoot,
                        action: classes.dialogAction
                    }}>

                </DialogActions>
            </MuiThemeProvider>
        </Dialog>
    );
};

SubscriptionsDetailsDialogBox.propTypes = {
    onFormSubmit: PropTypes.func,
    onHandleInputChange: PropTypes.func,
    contactNumbers: PropTypes.arrayOf(PropTypes.strings),
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withMobileDialog()(withStyles(styles)(SubscriptionsDetailsDialogBox));