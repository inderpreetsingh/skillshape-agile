import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { get, isEmpty } from 'lodash';
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from "material-ui/Dialog";
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import ClearIcon from 'material-ui-icons/Clear';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { FormGhostButton, SkillShapeButton, PrimaryButton, SecondaryButton } from '/imports/ui/components/landing/components/buttons/';
import { DialogBoxTitleBar } from './sharedDialogBoxComponents';
import { Text, SubHeading, Heading, ToggleVisibility } from '/imports/ui/components/landing/components/jss/sharedStyledComponents';
import { ContainerLoader } from "/imports/ui/loading/container";

import {
    capitalizeString
} from '/imports/util';

import muiTheme from "../jss/muitheme.jsx";
import * as helpers from "../jss/helpers.js";

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
            alignItems: 'center',
            justifyContent: 'space-between'
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

const DialogTitleContainer = styled.div`
  display: flex;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
`;


const DialogTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


const ClassName = SubHeading.extend`
    font-size: ${helpers.baseFontSize * 1.25}px;
    margin-bottom: ${helpers.rhythmDiv}px;
`;

const SchoolName = ClassName.withComponent('h2').extend`
`;

const DialogTitleText = SchoolName.extend`
    font-style: italic;
    font-weight: 300;
    margin-bottom: 0;
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
  position: relative;
  z-index: 0;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  padding: 0 ${helpers.rhythmDiv}px;
  margin-bottom: ${helpers.rhythmDiv}px;  
  justify-content: space-between;
  
  :first-child {
    border-top: 1px solid #e3e3e3;
    padding-top: ${helpers.rhythmDiv}px;
  }

  :after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }

  &:nth-child(2n + 1) {
    :after {
        background-color: ${helpers.primaryColor};
        opacity: 0.1;
    }
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
    ${props => props.left && `padding-right: ${helpers.rhythmDiv}px;`}
    ${props => props.noMarginBottom && 'margin-bottom: 0;'}
`;

const ClassNameWrapper = styled.div`
@media screen and(max - width: ${ helpers.mobile}px) {
    display: flex;
    flex-direction: column;
}
`;

// Class data buttons
const CDButtonsWrapper = styled.div`
display: flex;
align-items: center;
flex-wrap: wrap;
`;

const labelMaker = (notification) => {
    if (get(notification, 'notification', false)) {
        return 'Stop Notifications';
    }
    return 'Get Notifications';
}


const ClassDataButtons = (props) => (
    <CDButtonsWrapper>
        <ButtonWrapper left>
            {props.notification ?
                <SkillShapeButton
                    caution
                    fullWidth
                    label={labelMaker(props.classData.notification)}
                    onClick={props.onNotificationsButtonClick}
                /> :
                <SkillShapeButton
                    primary
                    fullWidth
                    label={labelMaker(props.classData.notification)}
                    onClick={props.onNotificationsButtonClick}
                />}
        </ButtonWrapper>
        <ButtonWrapper noMarginBottom>
            <SecondaryButton
                fullWidth
                label={`Leave class`}
                onClick={props.onLeaveClassButtonClick}
            />
        </ButtonWrapper>
    </CDButtonsWrapper>
)


const ManageMemberShipDialogBox = props => {
    // labelMaker = (notification) => {
    //     if (get(notification, 'notification', false)) {
    //         return 'Stop Notification';
    //     }
    //     return 'Resume Notification';
    // }
    // colorMaker = (notification) => {
    //     if (get(notification, 'notification', false)) {
    //         return 'caution';
    //     }
    //     return null;
    // }
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
        leaveSchool,
        schoolImg
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
                        src={get(selectedSchoolData, 'logoImg', get(selectedSchoolData, 'logoImgMedium', ""))} />
                    <DialogTitleWrapper>
                        <SchoolName>{capitalizeString(schoolName)}</SchoolName>
                        {studentName && <DialogTitleText>Edit membership for {capitalizeString(studentName)}</DialogTitleText>}
                    </DialogTitleWrapper>
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
                                        <ProfileImage
                                            imageContainerProps={{
                                                borderRadius: `50 % `,
                                                width: 84,
                                                height: 84
                                            }}
                                            src={get(classData, 'medium', get(classData, 'classTypeImg', get(selectedSchoolData)))} />

                                        <ClassNameWrapper>
                                            <ClassName> {capitalizeString(get(classData, 'name', 'Test Class Type'))} </ClassName>
                                            <ClassDataButtons
                                                classData={classData}
                                                notification={get(classData.notification, 'notification', false)}
                                                onLeaveClassButtonClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAll(get(classData, 'classTimes', []), get(classData, 'name', 'Test Class Type'))
                                                }}
                                                onNotificationsButtonClick={(e) => {
                                                    e.stopPropagation();
                                                    stopNotification(classData.notification)
                                                }}
                                            />
                                        </ClassNameWrapper>
                                    </ClassProfile>
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
                                                        <SecondaryButton
                                                            label="Remove from calendar"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeFromCalendar({ userId, classTimeId: classTimeData._id, classTypeName: get(classData, 'name', 'Test Class Type'), classTimeName: get(classTimeData, "name", 'Class Time Name') })
                                                            }}
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
                    {(!isEmpty(subscriptionsData)) && (<ButtonWrapper>
                        <FormGhostButton alertColor label="Leave school" onClick={leaveSchool} />
                    </ButtonWrapper>)}

                    <ButtonWrapper>
                        <FormGhostButton darkGreyColor label="Close" onClick={onModalClose} />
                    </ButtonWrapper>
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
