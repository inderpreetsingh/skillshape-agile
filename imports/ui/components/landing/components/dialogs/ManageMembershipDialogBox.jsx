import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get, isEmpty } from 'lodash';
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
    font-size: ${helpers.baseFontSize * 1.25}px;
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
  border-bottom: 1px solid #e3e3e3;
  padding: 0 ${helpers.rhythmDiv}px;
  margin-bottom: ${helpers.rhythmDiv}px;  
  justify-content: space-between;
  :first-child {
    border-top: 1px solid #e3e3e3;
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
    font-size: ${helpers.baseFontSize * 1.25}px;
`;

const DialogTitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const TitleWrapper = styled.div`

`;

const ClassDataButtons = (props) => (
    <React.Fragment>
        <ButtonWrapper>
            <FormGhostButton
                color="alert"
                label={`Leave ${get(props.classData, 'name', 'Test Class Type')}`}
                onClick={props.onLeaveClassButtonClick}
            />
        </ButtonWrapper>
        <ButtonWrapper>
            <FormGhostButton
                color="caution"
                label={labelMaker(props.classData.notification)}
                onClick={props.onNotificationsButtonClick}
            />
        </ButtonWrapper>
    </React.Fragment>
)


const ManageMemberShipDialogBox = props => {
    labelMaker = (notification) => {
        if (get(notification, 'notification', false)) {
            return 'Stop Notification';
        }
        return 'Resume Notification';
    }
    const {
        classes,
        onModalClose,
        schoolName,
        studentName,
        selectedSchoolData,
        subscriptionsData,
        open,
        stopNotification,
        isBusy,
        removeFromCalendar,
        userId,
        removeAll,
        leaveSchool
    } = props;
    // console.log("​subscriptionsData", subscriptionsData)
    return (
        <Dialog
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby="Manage Membership"
            classes={{ paper: classes.dialogPaper }}
        >
            {isBusy && <ContainerLoader />}
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitleContainer>
                    <ProfileImage
                        containerProps={{
                            borderRadius: `5px`
                        }}
                        src={get(selectedSchoolData, 'logoImg', get(selectedSchoolData, 'logoImgMedium', ""))} />
                    <TitleWrapper>
                        <Title>{schoolName}</Title>
                        <Title>Edit Membership for {studentName}</Title>
                    </TitleWrapper>
                    <IconButton
                        color="primary"
                        onClick={props.onModalClose}
                        classes={{ root: props.classes.iconButton }}>
                        <ClearIcon />
                    </IconButton >
                </DialogTitleContainer>

                <DialogContent classes={{ root: classes.dialogContent }}>
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
                                        <ProfileImage src={get(classData, 'medium', get(classData, 'classTypeImg', ""))} />

                                        <ClassNameWrapper>
                                            <ClassName> {get(classData, 'name', 'Test Class Type')} </ClassName>
                                            <ToggleVisibility>
                                                <ClassDataButtons
                                                    classData={classData}
                                                    onLeaveClassButtonClick={() => { removeAll(get(props.classData, 'classTimes', []), get(props.classData, 'name', 'Test Class Type')) }}
                                                    onNotificationsButtonClick={() => { stopNotification(props.classData.notification) }}
                                                />
                                            </ToggleVisibility>
                                        </ClassNameWrapper>

                                    </ClassProfile>

                                    <ToggleVisibility show>
                                        <ClassDataButtons
                                            classData={classData}
                                            onLeaveClassButtonClick={() => { removeAll(get(props.classData, 'classTimes', []), get(props.classData, 'name', 'Test Class Type')) }}
                                            onNotificationsButtonClick={() => { stopNotification(props.classData.notification) }}
                                        />
                                    </ToggleVisibility>
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
                                    <ClassTimesList>
                                        {classData.classTimes.map(classTimeData => {
                                            if (classTimeData == null) {
                                                return;
                                            }
                                            return (<ClassTimesListItem>
                                                <Text fontSize="18">{get(classTimeData, "name", 'Class Time Name')}</Text>
                                                <ActionButtons>
                                                    <ButtonWrapper>
                                                        <FormGhostButton
                                                            color="alert"
                                                            label="Remove from calendar"
                                                            onClick={() => { removeFromCalendar({ userId, classTimeId: classTimeData._id, classTypeName: get(classData, 'name', 'Test Class Type'), classTimeName: get(classTimeData, "name", 'Class Time Name') }) }}
                                                        />
                                                    </ButtonWrapper>

                                                </ActionButtons>
                                            </ClassTimesListItem>)
                                        })}
                                    </ClassTimesList>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>)}
                    </ContentWrapper>
                </DialogContent>

                <DialogActions
                    classes={{
                        root: classes.dialogActionsRoot,
                        action: classes.dialogAction
                    }}>
                    <ButtonWrapper>
                        <FormGhostButton color="primary" label="Close" onClick={onModalClose} />
                    </ButtonWrapper>
                    {(!isEmpty(subscriptionsData)) && (<ButtonWrapper>
                        <FormGhostButton color="alert" label="Leave school" onClick={leaveSchool} />
                    </ButtonWrapper>)}

                </DialogActions>
            </MuiThemeProvider>
        </Dialog>
    );
};

ManageMemberShipDialogBox.propTypes = {
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withMobileDialog()(withStyles(styles)(ManageMemberShipDialogBox));
