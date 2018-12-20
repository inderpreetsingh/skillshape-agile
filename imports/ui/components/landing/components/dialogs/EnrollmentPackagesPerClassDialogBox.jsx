import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { createContainer } from "meteor/react-meteor-data";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import { isEmpty, flatten, get, uniq } from "lodash";


import IconButton from "material-ui/IconButton";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import ClearIcon from "material-ui-icons/Clear";
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';


import Package from '/imports/ui/components/landing/components/class/packages/Package.jsx';
import { PrimaryButton } from "/imports/ui/components/landing/components/buttons/";
import { ContainerLoader } from "/imports/ui/loading/container.js";

import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import School from "/imports/api/school/fields";

import { withPopUp, stripePaymentHelper, normalizeMonthlyPricingData } from "/imports/util";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { dialogStyles } from './sharedDialogBoxStyles';
import { ActionButtons, DialogBoxTitleBar } from './sharedDialogBoxComponents';

const PackagesListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const PackageWrapper = styled.div`
    margin-bottom: ${helpers.rhythmDiv}px;
    :last-of-type {
        margin-bottom: 0;
    }
`;

const ActionButton = styled.div`
    display: flex;
    width: calc(50% - ${helpers.rhythmDiv}px);
    margin-bottom: ${helpers.rhythmDiv}px;

    @media screen and (max-width: ${helpers.mobile - 100}px) {
        width: 100%;
        :last-of-type {
            margin-bottom: 0;
        }  
    }
`;

const NotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  width: 100%;
  height: 100px;
  border-radius: 5px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 300px;
`;

const styles = theme => {
    return {
        ...dialogStyles,
        dialogActions: {
            width: '100%'
        },
        dialogContent: {
            ...dialogStyles.dialogContent,
            flexShrink: 0,
            flexDirection: 'column',
            paddingBottom: 0,
            [`@media screen and (max-width: ${helpers.mobile}px)`]: {
                padding: `0 ${helpers.rhythmDiv * 2}px`,
            }
        },
        iconButton: {
            ...dialogStyles.iconButton,
            position: 'absolute',
            top: helpers.rhythmDiv,
            right: helpers.rhythmDiv
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
            justifyContent: 'space-between',
            [`@media screen and (max-width: ${helpers.mobile}px)`]: {
                flexDirection: 'column',
                "& > :last-child": {
                    paddingRight: 0
                }
            }
        }
    }
}


class EnrollmentPackagesPerClassDialogBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { props } = this;
        const {
            classes,
            open,
            onModalClose,
            schoolId,
            packagesListData,
            currency,
            isLoading
        } = props;

        const {
            selectedPackageIndex,
            radioButtonGroupValue
        } = this.state;


        return (<Dialog
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby={"packages"}
            classes={{ paper: classes.dialogRoot }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                    <DialogBoxTitleBar
                        title="Purchase Enrollment Package First"
                        classes={classes}
                        onModalClose={onModalClose}
                    />
                </DialogTitle>
                {isLoading ?
                    <ContainerLoader />
                    :
                    <DialogContent classes={{ root: classes.dialogContent }}>
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
                                    <SubHeading> {school.name} </SubHeading>
                                </SchoolProfile>

                                <ActionButtons
                                    data={school}
                                    email={getOurEmail(school)}
                                    phone={getContactNumbers(school)}
                                    schoolSlug={school.slug}
                                    onEditMemberShip={handleManageMemberShipDialogBox(true, schoolData)}

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
                                            maxListHeight={300}
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
                    </DialogContent>}

                <DialogActions classes={{ root: classes.dialogActionsRoot, action: classes.dialogActions }}>
                    <ActionButtons>
                        <ActionButton
                        >
                            <PrimaryButton
                                fullWidth
                                label={'Send Link'}
                                onClick={this.handleSendLink} />
                        </ActionButton>
                        <ActionButton
                        >
                            <PrimaryButton
                                fullWidth
                                label={'Accept Payment'}
                                onClick={this.handlePurchasePackage} />
                        </ActionButton>
                    </ActionButtons>
                </DialogActions>
            </MuiThemeProvider>
        </Dialog >
        );
    }
}

EnrollmentPackagesPerClassDialogBox.propTypes = {
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withStyles(styles)(createContainer(props => {
    const { classTypeId } = props;
    //TODO: Need to filter out packages which are already purchased..
    //let purchasesData = 
    let monthlyPricingSubscription;
    let classPricingSubscription;
    let enrollmentSubscription;
    let isLoading = true;
    let currency = config.defaultCurrency;
    //console.log(classData,props,'classTYpeid')
    if (classTypeId) {
        enrollmentSubscription = Meteor.subscribe('enrollmentFee.getClassTypeEnrollMentFree', { classTypeId })
    }

    const sub1Ready = enrollmentSubscription && enrollmentSubscription.ready();
    // console.info(sub1Ready, sub2Ready, sub3Ready, ">>>>>>>>>>>>>");
    if (sub1Ready) {
        isLoading = false;
    }

    const enrollmentFeeData = EnrollmentFees.find().fetch();

    return {
        ...props,
        isLoading,
        enrollmentFeeData,
        currency
    };
}, withPopUp(EnrollmentPackagesPerClassDialogBox)));
