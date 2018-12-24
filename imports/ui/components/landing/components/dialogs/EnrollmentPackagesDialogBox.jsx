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

import ClassType from '/imports/api/classType/fields';
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import School from "/imports/api/school/fields";

import {
    withPopUp,
    stripePaymentHelper,
    normalizeMonthlyPricingData,
    seperatePackagesPerClass,
} from "/imports/util";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

import { dialogStyles } from './sharedDialogBoxStyles';
import { Heading, SubHeading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { ActionButtons, DialogBoxTitleBar } from './sharedDialogBoxComponents';

const PACKAGE_WIDTH = 220;

const PackagesListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    padding: ${helpers.rhythmDiv * 2}px;

    ::after {
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 0;

		background-color: ${helpers.primaryColor};
		opacity: 0.1;
    }

    :nth-of-type(2n) {
        ::after {
            background-color: #ddd;
        }
    }

`;

const PackageListTitle = SubHeading.extend`
    text-align: center;
    font-size: 20px;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Packages = styled.div`
    ${helpers.flexCenter}
    flex-wrap: wrap;
    margin: 0 auto;
    max-width: ${PACKAGE_WIDTH * 2 + helpers.rhythmDiv * 2}px;
    width: 100%;
    justify-content: ${props => props.packagesLength > 1 ? 'flex-start' : 'center'};

    @media screen and (max-width: ${helpers.mobile + 50}px) {
        max-width: auto;
        margin: 0;
        align-content: center;
        flex-direction: column;
    }
`;

const PackageWrapper = styled.div`
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    margin-right: ${helpers.rhythmDiv * 2}px;
    
    :nth-of-type(2n) {
        margin-right: 0;
    }

    @media screen and (max-width: ${helpers.mobile + 50}px) {
       margin-right: 0;
    }
`;

const ActionButton = styled.div`
    display: flex;
    width: calc(50% - ${ helpers.rhythmDiv}px);
    margin-bottom: ${ helpers.rhythmDiv} px;

    @media screen and(max-width: ${ helpers.mobile - 100}px) {
        width: 100%;

        :last-of-type {
            margins-bottom: 0;
        }
    }
`;


const styles = theme => {
    return {
        ...dialogStyles,
        dialogRoot: {
            ...dialogStyles.dialogRoot,
            margin: `${helpers.rhythmDiv * 4}px ${helpers.rhythmDiv * 2}px`
        },
        dialogActions: {
            width: '100%'
        },
        dialogContent: {
            ...dialogStyles.dialogContent,
            flexShrink: 0,
            flexDirection: 'column',
            padding: 0,
        },
        iconButton: {
            ...dialogStyles.iconButton,
            position: 'absolute',
            top: helpers.rhythmDiv,
            right: helpers.rhythmDiv
        },
    }
}


class EnrollmentPackagesDialogBox extends Component {
    constructor(props) {
        super(props);
    }

    getClassName = (classTypeId) => {
        // console.log(classTypeId, ClassType.find({ _id: classTypeId }).fetch(), '.......')
        return ClassType.findOne({ _id: classTypeId }).name;
    }

    render() {
        const { props } = this;
        const {
            classes,
            open,
            onModalClose,
            schoolId,
            packagesData,
            currency,
            isLoading
        } = props;
        // console.log("RENDERING>>>>>>>>>>>> ENROLLMENT PACKAGES DIALOG BOX", this.props);
        return (<Dialog
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby={"enrollment-packages"}
            classes={{ paper: classes.dialogRoot }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                    <DialogBoxTitleBar
                        titleProps={{
                            fontSize: '24px'
                        }}
                        title="Purchase Enrollment Package First"
                        classes={classes}
                        onModalClose={onModalClose}
                    />
                </DialogTitle>
                {isLoading ?
                    <ContainerLoader />
                    :
                    (<DialogContent classes={{ root: classes.dialogContent }}>
                        {packagesData.map((data, i) => (
                            <PackagesListWrapper key={i}>
                                <PackageListTitle>For Class {this.getClassName(data.classTypeId)}</PackageListTitle>
                                <Packages packagesLength={data.packages.length}>
                                    {data.packages.map((packageData, i) =>
                                        <PackageWrapper key={packageData._id}>
                                            <Package
                                                packageType="EP"
                                                appearance="small"
                                                usedFor="enrollmentPackagesDialog"
                                                {...packageData}
                                            />
                                        </PackageWrapper>)}
                                </Packages>
                            </PackagesListWrapper>))}
                    </DialogContent>)}

                <DialogActions classes={{
                    root: classes.dialogActionsRoot,
                    action: classes.dialogActions
                }}>
                </DialogActions>
            </MuiThemeProvider>
        </Dialog >
        );
    }
}

EnrollmentPackagesDialogBox.propTypes = {
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withStyles(styles)(createContainer(props => {
    const { classTypeIds, schoolId } = props;
    //TODO: Need to filter out packages which are already purchased..
    //let purchasesData =
    let enrollmentSubscription;
    let classTypeSubscription;
    let isLoading = true;
    let currency = config.defaultCurrency;
    //console.log(classData,props,'classTYpeid')
    if (schoolId) {
        classTypeSubscription = Meteor.subscribe('classType.getclassType', { schoolId });
        enrollmentSubscription = Meteor.subscribe('enrollmentFee.getEnrollmentFee', { schoolId })
    }
    else if (classTypeIds.length) {
        classTypeSubscription = Meteor.subscribe('classType.getClassTypeWithIds', { classTypeIds })
        enrollmentSubscription = Meteor.subscribe('enrollmentFee.getClassTypesEnrollMentFee', { classTypeIds })
    }

    const sub1Ready = enrollmentSubscription && enrollmentSubscription.ready();
    const sub2Ready = classTypeSubscription && classTypeSubscription.ready();
    // console.info(sub1Ready, sub2Ready, sub3Ready, ">>>>>>>>>>>>>");
    if (sub1Ready && sub2Ready) {
        isLoading = false;
    }

    const enrollmentFeeData = EnrollmentFees.find().fetch();
    const allClassTypeIds = ClassType.find().fetch().map(data => data._id);
    console.info(enrollmentFeeData, allClassTypeIds, "----")
    return {
        ...props,
        isLoading,
        packagesData: seperatePackagesPerClass(enrollmentFeeData, allClassTypeIds),
        currency
    };

}, withPopUp(EnrollmentPackagesDialogBox)));
