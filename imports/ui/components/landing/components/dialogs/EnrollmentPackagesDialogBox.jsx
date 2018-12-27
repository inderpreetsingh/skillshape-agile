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
    font-size: 15px;
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
    render() {
        const { props } = this;
        const {
            classes,
            open,
            onModalClose,
            schoolId,
            epData,
            isLoading,
            onAddToCartIconButtonClick,
            currentPackage,
            classTypeWithEp,
            packageType,
            classPackages,
            classTypeWithNoEpNames,
            classTypeWithEpNames
        } = props;
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
                        title="Enrollment Package May Be Required"
                        classes={classes}
                        onModalClose={onModalClose}
                    />
                </DialogTitle>
                {isLoading ?
                    <ContainerLoader />
                    :
                    (<DialogContent classes={{ root: classes.dialogContent }}>
                    {!isEmpty(currentPackage) && (
                        <PackagesListWrapper key={packageType}>
                       <PackageListTitle>If you plan to attend <b>{classTypeWithNoEpNames.join(', ')}</b> you do not need the enrollment package.</PackageListTitle>
                       { currentPackage.map((obj)=>{
                        return (
                            <PackageWrapper key={obj._id}>
                            <Package
                                onAddToCartIconButtonClick = {onAddToCartIconButtonClick}
                                packageType = {packageType}
                                {...obj}
                                classPackages = {classPackages}
                                appearance="small"
                                usedFor="enrollmentPackagesDialog"
                            />
                        </PackageWrapper>
                        )
                      })}
                     </PackagesListWrapper>
                    )}
                        {!isEmpty(classTypeWithEp) && classTypeWithEp.map((data, i) => {
                            if(data.epStatus) return;
                            return (<PackagesListWrapper key={i}>
                                <PackageListTitle>If you plan to attend <b>{get(data,'name','Class Name')}</b> your will need to purchase one of the following:</PackageListTitle>
                                <Packages packagesLength={data.enrollmentPackages.length}>
                                    {data.enrollmentPackages.map((packageData, i) =>
                                        <PackageWrapper key={packageData._id}>
                                            <Package
                                                packageType="EP"
                                                appearance="small"
                                                onAddToCartIconButtonClick = {onAddToCartIconButtonClick}
                                                usedFor="enrollmentPackagesDialog"
                                                {...packageData}
                                            />
                                        </PackageWrapper>)}
                                </Packages>
                            </PackagesListWrapper>)
                            })}
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
    let isLoading=false;
    const {epData,currentPackageData:{packageType, packageId,currency}} = props;
    let classTypeWithNoEp=[],classTypeWithEp=[],classTypeWithNoEpNames=[],currentPackage=[],classPackages= false,classTypeWithEpNames=[] ;
    !isEmpty(epData) && epData.map((obj)=>{
        if(obj.noEP || isEmpty(get(obj,'enrollmentPackages',[]))){
            classTypeWithNoEp.push(obj);
            classTypeWithNoEpNames.push(obj.name);
        }
        else if(!isEmpty(obj.enrollmentPackages)){
            classTypeWithEpNames.push(obj.name);
            classTypeWithEp.push(obj);
        }
    })
    if(!isEmpty(classTypeWithNoEp)){
        if(packageType == 'CP'){
            Meteor.subscribe("classPricing.getClassPricingFromId", { _id:[packageId] });
            currentPackage = ClassPricing.find({_id:packageId }).fetch();
            classPackages = true;
        }
        else if(packageType == 'MP'){
            Meteor.subscribe("monthlyPricing.getMonthlyPricingFromId",  { _id:[packageId] });
            currentPackage = MonthlyPricing.find({_id:packageId }).fetch();
            currentPackage = normalizeMonthlyPricingData(currentPackage);
        }
        console.log("​currentPackage", currentPackage)
    }
    return {
        ...props,
        isLoading,
        classTypeWithNoEp,
        classTypeWithEp,
        classTypeWithNoEpNames,
        currentPackage,
        packageType,
        classPackages,
        classTypeWithEpNames
       
    };
}, withPopUp(EnrollmentPackagesDialogBox)));
