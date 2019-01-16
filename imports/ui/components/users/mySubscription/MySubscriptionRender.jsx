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
import { CallUsDialogBox, EmailUsDialogBox, ManageMemberShipDialogBox } from '/imports/ui/components/landing/components/dialogs/';

import SubscriptionsList from '/imports/ui/componentHelpers/subscriptions/SubscriptionsList.jsx';
import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';

import { Heading, SubHeading, ToggleVisibility } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { schoolLogo } from '/imports/ui/components/landing/site-settings.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

stopNotification = (payload) => {
    this.setState({ isBusy: true });
    let data = {};
    data.classTypeId = payload.classTypeId;
    data.userId = payload.userId;
    data.notification = !payload.notification;
    Meteor.call("classTypeLocationRequest.updateRequest", data, (err, res) => {
        const { popUp } = this.props;
        if (res) {
            Meteor.call("classTimesRequest.updateRequest", data, (err1, res1) => {
                if (res1) {
                    this.setState({ isBusy: false });
                    popUp.appear("success", {
                        content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`
                    });
                }
            });
        }
        else {
            this.setState({ isBusy: false });
            popUp.appear("success", {
                content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`
            });
        }
    });
}



const styles = {
    profileIconButton: {
        background: 'white',
        width: 24,
        height: 24,
        fontSize: helpers.baseFontSize,
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
        height: 200,
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
	max-width: 800px;
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

const ProfileIcons = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const ActionButtons = (props) => (
    <ActionButtonsWrapper>
        <ActionButton onClick={props.onEditMemberShip}>
            <FormGhostButton fullWidth icon iconName="remove_from_queue" label="Edit Membership" />
        </ActionButton>
        <ActionButton onClick={props.onSchoolVisit(props.schoolSlug)}>
            <FormGhostButton fullWidth icon iconName="school" label="Visit School" />
        </ActionButton>
        {/*
        {props.phone && props.phone.length && <ActionButton onClick={props.onCall(props.phone)}>
            <FormGhostButton icon iconName="phone" label="Call" />
        </ActionButton>}

        {props.email && <ActionButton onClick={props.onEmail(props.email, props.data)}>
            <FormGhostButton icon iconName="email" label="Email" noMarginBottom />
        </ActionButton>}
        */}
    </ActionButtonsWrapper>
);

const ContactSchool = (props) => (
    <ProfileIcons>
        {props.phone && props.phone.length && <IconButton classes={{ root: props.classes.profileIconButton }}>
            <Call onClick={props.onCallClick(props.phone)} />
        </IconButton>}
        {props.email && <IconButton classes={{ root: props.classes.profileIconButton }}>
            <Email onClick={props.onEmailClick(props.email, props.data)} />
        </IconButton>}
    </ProfileIcons>
);

const MySubscriptionRender = (props) => {
    const getSubsDataBasedOnSchool = (schoolId, purchaseData) => {
        return purchaseData.filter((sbsData) => sbsData.schoolId === schoolId);
    };

    const {
        src,
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
        handleSchoolVisit,
        manageMemberShipDialog,
        handleManageMemberShipDialogBox,
        removeAll,
        stopNotification,
        leaveSchool,
        removeFromCalendar,
        isBusy,
        subscriptionsData
    } = props;

    let studentName = get(currentUser, 'profile.firstName', get(currentUser, 'profile.name', 'Old Data'));
    let userId = get(currentUser, '_id', null);
    let schoolName = get(schoolData[0], 'name', null);
    return (
        <Fragment>
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
                    schoolData.map((school) => {
                        const EXPIRED = 'expired';
                        const subscriptionsData = getSubsDataBasedOnSchool(school._id, purchaseData);
                        const activeSubsData = subscriptionsData.filter(subs => subs.packageStatus != EXPIRED);
                        const expiredSubsData = subscriptionsData.filter(subs => subs.packageStatus == EXPIRED || subs.status == EXPIRED);

                        // console.group(' MY SUBSCRIPTION');
                        // console.log(activeSubsData, expiredSubsData, '===============');
                        // console.group();

                        return (
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
