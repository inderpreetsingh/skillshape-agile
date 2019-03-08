import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withStyles } from 'material-ui/styles';
import { get, isEmpty } from "lodash";

import Call from 'material-ui-icons/Call';
import Email from 'material-ui-icons/Email';
import IconButton from 'material-ui/IconButton';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import { FormGhostButton } from '/imports/ui/components/landing/components/buttons/';
import { CallUsDialogBox, EmailUsDialogBox, ManageMemberShipDialogBox,PrivacySettings } from '/imports/ui/components/landing/components/dialogs/';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import SubscriptionsList from '/imports/ui/componentHelpers/subscriptions/SubscriptionsList.jsx';
import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';

import { Heading, SubHeading, ToggleVisibility } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { schoolLogo } from '/imports/ui/components/landing/site-settings.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
const styles = {
    contactIconButton: {
        background: 'white',
        width: 24,
        height: 24,
        fontSize: helpers.baseFontSize,
    },
    expansionIcon: {
        [`@media screen and (max-width: ${helpers.mobile + 50}px)`]: {
            position: 'relative',
            top: -1 * helpers.rhythmDiv
        }
    },
    expansionPanelRoot: {
        border: 'none'
    },
    expansionPanelRootExpanded: {
        border: `1px solid black`
    },
    expansionPanelDetails: {
        padding: 0,
        marginTop: helpers.rhythmDiv,
        maxHeight: 280,
        overflowY: 'auto'
    },
    expansionPanelSummary: {
        margin: 0,
        padding: helpers.rhythmDiv
    },
    expansionPanelSummaryContent: {
        margin: 0,
        justifyContent: 'space-between',
        [`@media screen and (max-width: ${helpers.mobile + 50}px)`]: {
            flexDirection: 'column',
            "& > :last-child": {
                paddingRight: 0
            }
        }
    }
};

const SchoolName = SubHeading.extend`
    width: 160px;

    @media screen and (max-width: ${helpers.mobile + 50}px) {
        width: auto;
    }
`;

const Wrapper = styled.div`
	max-width: 869px;
	margin: 0 auto;
	margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

const ActionButtonsWrapper = styled.div`
	${helpers.flexCenter} left: ${helpers.rhythmDiv * 2}px;
	bottom: ${helpers.rhythmDiv * 2}px;
	padding: ${helpers.rhythmDiv}px;
	right: auto;
	margin-left: ${helpers.rhythmDiv}px;
	// flex-wrap: wrap;

    @media screen and (max-width: ${helpers.tablet - 100}px) {
        flex-direction: column;
        justify-content: flex-start;
    }

    @media screen and (max-width: ${helpers.mobile + 50}px) {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }

    @media screen and (max-width: ${helpers.mobile - 100}px) {
        flex-direction: column;
    }
`;

const ActionButton = styled.div`
    display: flex;
    margin-right: ${helpers.rhythmDiv}px;
	margin-bottom: ${helpers.rhythmDiv}px;
    @media screen and (max-width: ${helpers.tablet - 100}px) {
        width: 100%;
    }

    @media screen and (max-width: ${helpers.mobile + 50}px) {
        width: auto;
    }
    
    @media screen and (max-width: ${helpers.mobile - 100}px) {
        width: 100%;
    }
 `;

const Subscriptions = styled.div`
	display: flex;
	width: 100%;

	@media screen and (max-width: ${helpers.tablet}px) {
		flex-direction: column;
	}
`;

const ListWrapper = styled.div`
	width: 100%;
	@media screen and (max-width: ${helpers.tablet}px) {
		width: 100%;
	}
`;

const PageTitle = Heading.extend`
	font-size: ${helpers.baseFontSize * 2}px;
	text-align: center;
	margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const SchoolProfile = styled.div`
	/* prettier-ignore */
    ${helpers.flexCenter}
    
    @media screen and (max-width: ${helpers.mobile + 50}px) {
        justify-content: flex-start;
        padding-left: ${helpers.rhythmDiv}px;
    }
`;

const Profile = styled.div``;

const ContactIcons = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const ActionButtons = (props) => (
    <ActionButtonsWrapper>
        <ActionButton onClick={props.onPrivacySettingsClick}>
            <FormGhostButton fullWidth icon iconName="settings" label="Privacy Settings" />
        </ActionButton>
        <ActionButton onClick={props.onEditMemberShip}>
            <FormGhostButton fullWidth icon iconName="remove_from_queue" label="Edit Membership" />
        </ActionButton>
        <ActionButton onClick={props.onSchoolVisit(props.schoolSlug)}>
            <FormGhostButton fullWidth icon iconName="school" label="Visit School" />
        </ActionButton>
    </ActionButtonsWrapper>
);

const ContactSchool = (props) => (
    <ContactIcons>
        {props.phone && props.phone.length && <IconButton classes={{ root: props.classes.contactIconButton }}>
            <Call onClick={props.onCallClick(props.phone)} />
        </IconButton>}
        {props.email && <IconButton classes={{ root: props.classes.contactIconButton }}>
            <Email onClick={props.onEmailClick(props.email, props.data)} />
        </IconButton>}
    </ContactIcons>
);

const MySubscriptionRender = (props) => {
    const getSubsDataBasedOnSchool = (schoolId, purchaseData) => {
        return purchaseData.filter((sbsData) => sbsData.schoolId === schoolId);
    };

    const {
        email,
        phone,
        classes,
        schoolData,
        currentUser,
        purchaseData,
        callUsDialog,
        emailUsDialog,
        handleCall,
        handleEmail,
        getOurEmail,
        selectedSchool,
        getContactNumbers,
        handleModelState,
        manageMemberShipDialog,
        handleManageMemberShipDialogBox,
        removeAll,
        stopNotification,
        leaveSchool,
        removeFromCalendar,
        isBusy,
        subscriptionsData,
        emailAccess,
        phoneAccess,
        memberId,
        onPrivacySettingsClick,
        privacySettings
    } = props;

    let studentName = get(currentUser, 'profile.firstName', get(currentUser, 'profile.name', 'Old Data'));
    let userId = get(currentUser, '_id', null);
    let schoolName = get(schoolData[0], 'name', null);
    return (
        <Fragment>
            { privacySettings &&
                <PrivacySettings
                open={privacySettings}
                onModalClose={()=>{onPrivacySettingsClick(false)}}
                schoolName={schoolName}
                memberId={memberId}
                emailAccess = {emailAccess}
                phoneAccess = {phoneAccess}
                />
            }
            {isBusy && <ContainerLoader/>}
            {manageMemberShipDialog && (
                <ManageMemberShipDialogBox
                    subscriptionsData={subscriptionsData || []}
                    studentName={studentName}
                    open={manageMemberShipDialog}
                    onModalClose={handleManageMemberShipDialogBox(false, schoolData)}
                    removeAll={removeAll}
                    stopNotification={stopNotification}
                    leaveSchool={leaveSchool}
                    removeFromCalendar={removeFromCalendar}
                    isBusy={isBusy}
                    userId={userId}
                    selectedSchoolData={selectedSchool}
                    memberId = {memberId}
                />
            )}
            {callUsDialog && (
                <CallUsDialogBox
                    contactNumbers={[phone]}
                    open={callUsDialog}
                    onModalClose={handleModelState('callUsDialog', false)}
                />
            )}
            {emailUsDialog && (
                <EmailUsDialogBox
                    ourEmail={email}
                    schoolData={selectedSchool}
                    open={emailUsDialog}
                    onModalClose={handleModelState('emailUsDialog', false)}
                />
            )}
            <PageTitle>My Subscriptions</PageTitle>
            <Wrapper>
                {!isEmpty(schoolData) &&
                    schoolData.map((school,index) => {
                        const EXPIRED = 'expired';
                        const subscriptionsData = getSubsDataBasedOnSchool(school._id, purchaseData);
                        const activeSubsData = subscriptionsData.filter(subs => subs.packageStatus != EXPIRED);
                        const expiredSubsData = subscriptionsData.filter(subs => subs.packageStatus == EXPIRED || subs.status == EXPIRED);

                        return (
                            <ExpansionPanel
                                classes={{
                                    root: classes.expansionPanelRoot
                                }}
                                defaultExpanded={index == 0}
                            >
                                <ExpansionPanelSummary
                                    classes={{
                                        root: classes.expansionPanelSummary,
                                        content: classes.expansionPanelSummaryContent
                                    }}
                                    expandIcon={
                                        <ExpandMoreIcon className={classes.expansionIcon} />
                                    }
                                >
                                    <SchoolProfile>
                                        <Profile>
                                            <ProfileImage
                                                imageContainerProps={{
                                                    position: 'relative'
                                                }}
                                                src={get(school, 'logoImgMedium', get(school, 'logoImg', schoolLogo))} >
                                                <ContactSchool
                                                    classes={classes}
                                                    data={school}
                                                    email={getOurEmail(school)}
                                                    phone={getContactNumbers(school)}
                                                    onCallClick={handleCall}
                                                    onEmailClick={handleEmail}
                                                />
                                            </ProfileImage>
                                        </Profile>
                                        <SchoolName> {school.name} </SchoolName>
                                    </SchoolProfile>

                                    <ActionButtons
                                        data={school}
                                        email={getOurEmail(school)}
                                        phone={getContactNumbers(school)}
                                        schoolSlug={school.slug}
                                        onEditMemberShip={handleManageMemberShipDialogBox(true, school)}
                                        onPrivacySettingsClick = {()=>{onPrivacySettingsClick(true,school)}}
                                        onSchoolVisit={props.handleSchoolVisit}
                                    />
                                </ExpansionPanelSummary>

                                <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
                                    <Subscriptions>
                                        <ListWrapper>
                                            <SubscriptionsList
                                                active
                                                packageProps={{
                                                    bgColor: 'white',
                                                    opacity: 1
                                                }}
                                                subsType="mySubscriptions"
                                                subsData={activeSubsData}
                                                title={
                                                    isEmpty(activeSubsData) ? (
                                                        'No Active Subscriptions'
                                                    ) : (
                                                            'Active Subscriptions'
                                                        )
                                                }
                                            />
                                        </ListWrapper>
                                        {/* <ListWrapper>
                                            <SubscriptionsList
                                                subsType="mySubscriptions"
                                                maxListHeight={300}
                                                packageProps={{
                                                    bgColor: helpers.primaryColor,
                                                    opacity: 0.1
                                                }}
                                                subsData={expiredSubsData}
                                                title={
                                                    isEmpty(expiredSubsData) ? (
                                                        'No Expired Subscriptions'
                                                    ) : (
                                                            'Expired Subscriptions'
                                                        )
                                                }
                                            />
                                        </ListWrapper> */}
                                    </Subscriptions>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        );
                    })}
            </Wrapper>
        </Fragment>
    );
};

export default withStyles(styles)(MySubscriptionRender);
