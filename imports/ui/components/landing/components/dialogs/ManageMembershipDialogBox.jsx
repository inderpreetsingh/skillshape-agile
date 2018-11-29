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
import { Text, SubHeading, Heading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, {
    DialogContent,
    DialogTitle,
    DialogActions,
    withMobileDialog
} from "material-ui/Dialog";

import { ContainerLoader } from "/imports/ui/loading/container";

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
            flexShrink: 0,
            '@media screen and (max-width : 500px)': {
                minHeight: '150px'
            }
        },
        dialogPaper: {
            maxWidth: 600,
            width: '100%',
            margin: helpers.rhythmDiv
        },
        dialogActionsRoot: {
            padding: `0 ${helpers.rhythmDiv}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-start'
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
        expansionPanelRoot: {
            border: 'none'
        },
        expansionPanelRootExpanded: {
            border: `1px solid black`
        },
        expansionPanelDetails: {
            padding: 0,
            marginTop: helpers.rhythmDiv
        },
        expansionPanelSummary: {
            margin: 0,
            padding: helpers.rhythmDiv
        },
        expansionPanelSummaryContent: {
            margin: 0,
            alignItems: 'center',
            justifyContent: 'space-between'
        }
    };
};

const ContentWrapper = styled.div`
  width: 100%;
`;

const WrapperContact = styled.li`
  ${helpers.flexCenter} display: inline-flex;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: ${helpers.rhythmDiv}px;
  border: 1px solid ${helpers.primaryColor};
`;

const Title = SubHeading.extend`
    font-style: italic;
    font-weight: 300;
`;

const ClassProfile = styled.div`
	/* prettier-ignore */
	${helpers.flexCenter}
`;

const ClassTimesList = styled.ul`
  margin: ${helpers.rhythmDiv}px;
`;

const ClassTimesListItem = styled.li`
  list-style: none;
  display: flex;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;


const ManageMemberShipDialogBox = props => {
    // console.log(props,"...");
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
                        title={"Manage Heading"}
                        onModalClose={onModalClose}
                        classes={classes}
                    />
                </DialogTitle>

                <DialogContent classes={{ root: classes.dialogContent }}>
                    <Title>Edit Membership for {studentName} at {schoolName}</Title>
                    <ContentWrapper>
                        {subscriptionsData.map(classData =>
                            <ExpansionPanel
                                classes={{
                                    root: classes.expansionPanelRoot
                                }}
                            >
                                <ExpansionPanelSummary
                                    classes={{
                                        root: classes.expansionPanelSummary,
                                        content: classes.expansionPanelSummaryContent
                                    }}
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <ClassProfile>
                                        <ProfileImage src={get(classData, 'logoImgMedium', get(classData, 'logoImg', ""))} />
                                        <Title> {classData.name} </Title>
                                    </ClassProfile>

                                    <ButtonWrapper>
                                        <FormGhostButton
                                            color="alert"
                                            label="Remove All"
                                        />
                                    </ButtonWrapper>
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
                                    <ClassTimesList>
                                        {classData.classTimes.map(classTimeData => <ClassTimesListItem>
                                            <Text>{classTimeData.name}</Text>,
                                        </ClassTimesListItem>)}
                                    </ClassTimesList>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>)}
                    </ContentWrapper>
                </DialogContent>

                <DialogActions
                    classes={{ root: classes.dialogActionsRoot, action: classes.dialogAction }}>

                </DialogActions>
            </MuiThemeProvider>
        </Dialog>
    );
};

ManageMemberShipDialogBox.propTypes = {
    onFormSubmit: PropTypes.func,
    onHandleInputChange: PropTypes.func,
    contactNumbers: PropTypes.arrayOf(PropTypes.strings),
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withMobileDialog()(withStyles(styles)(ManageMemberShipDialogBox));
