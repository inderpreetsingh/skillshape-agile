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
        expansionPanelRoot: {
            border: 'none'
        },
        expansionPanelRootExpanded: {
            border: `1px solid black`
        },
        expansionPanelDetails: {
            padding: 0,
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
    text-align: center;
    font-weight: 300;
`;

const ClassProfile = styled.div`
	/* prettier-ignore */
	${helpers.flexCenter}
`;

const ClassTimesList = styled.ul`
  width: 100%;
  padding: 0;
  margin-bottom: ${helpers.rhythmDiv}px;

`;

const ClassTimesListItem = styled.li`
  list-style: none;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #333;
  padding: 0 ${helpers.rhythmDiv}px;
  margin-bottom: ${helpers.rhythmDiv}px;  
  justify-content: space-between;
  :first-child {
    border-top: 1px solid #333;
    padding-top: ${helpers.rhythmDiv}px;
  }

  @media screen and (max-width: ${helpers.mobile - 100}px) {
    flex-direction: column;
  }
`;

const ActionButtons = styled.div`
    ${helpers.flexCenter}
    flex-direction: column;
`;

const ButtonWrapper = styled.div`
    display: flex;
    margin-bottom: ${helpers.rhythmDiv}px;
`;

const ClassNameWrapper = styled.div`
  @media screen and (max-width: ${helpers.mobile}px) {
    display: flex;
    flex-direction: column;   
  }
`;

const ClassName = Text.extend`
    font-size: ${helpers.baseFontSize * 1.5}px;
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
                        title={"Manage Membership"}
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

                                        <ClassNameWrapper>
                                            <ClassName> {classData.name} </ClassName>
                                            <ToggleVisibility>
                                                <ButtonWrapper>
                                                    <FormGhostButton
                                                        color="alert"
                                                        label="Remove all"
                                                    />
                                                </ButtonWrapper>
                                            </ToggleVisibility>
                                        </ClassNameWrapper>

                                    </ClassProfile>

                                    <ToggleVisibility show>
                                        <ButtonWrapper>
                                            <FormGhostButton
                                                color="alert"
                                                label="Remove all"
                                            />
                                        </ButtonWrapper>
                                    </ToggleVisibility>
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
                                    <ClassTimesList>
                                        {classData.classTimes.map(classTimeData => <ClassTimesListItem>
                                            <Text fontSize="18">{classTimeData.name}</Text>
                                            <ActionButtons>
                                                <ButtonWrapper>
                                                    <FormGhostButton
                                                        color="alert"
                                                        label="Remove from calendar" />
                                                </ButtonWrapper>
                                                <ButtonWrapper>
                                                    <FormGhostButton
                                                        color="caution"
                                                        label="Stop notifications"
                                                    />
                                                </ButtonWrapper>
                                            </ActionButtons>
                                        </ClassTimesListItem>)}
                                    </ClassTimesList>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>)}
                    </ContentWrapper>
                </DialogContent>

                <DialogActions
                    classes={{ root: classes.dialogActionsRoot, action: classes.dialogAction }}>
                    <ButtonWrapper>
                        <FormGhostButton color="alert" label="Leave school" />
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <FormGhostButton color="caution" label="Remove all notifications" />
                    </ButtonWrapper>
                    <ButtonWrapper>
                        <FormGhostButton color="primary" label="Save changes" />
                    </ButtonWrapper>
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
