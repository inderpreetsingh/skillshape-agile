import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import { createContainer } from "meteor/react-meteor-data";
import React from 'react';
import styled from "styled-components";
import PackagesList from "/imports/ui/components/landing/components/class/packages/PackagesList.jsx";
import muiTheme from '../jss/muitheme.jsx';
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { mobile } from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import School from "/imports/api/school/fields";
import {get} from 'lodash';
import { EnrollmentPackagesDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import { withPopUp, stripePaymentHelper, normalizeMonthlyPricingData } from "/imports/util";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
  
`;




const styles = {
    dialogAction: {
        width: '100%'
    },
    dialogActionsRoot: {
        [`@media screen and (max-width: ${mobile}px)`]: {
            flexWrap: "wrap",
            justifyContent: "flex-start"
        }
    }
}



class ClassTypePackages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidUpdate() {
        const { popUp, currentUser } = this.props;
        if (currentUser) {
            if (popUp.details.purpose === 'login-alert' && popUp.isPopupActive())
                popUp.close();
        }
    }

    handlePurchasePackage = async (packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType) => {

        try {
            let userId = this.props.userId;
            this.packagesRequired = this.props.fromSignFunctionality ? this.props.packagesRequired : null;
            stripePaymentHelper.call(this, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType);
        } catch (error) {
            console.log('Error in handlePurchasePackage', error);
        }
    }
    generateTitle = () =>{
        if(this.props.packagesRequired == 'perClassAndMonthly'){
            return '';
        }
        return 'Your Enrollment Fee has been processed successfully.';
    }
    generateContent = () =>{
        if(this.props.packagesRequired == 'perClassAndMonthly'){
            return '';  
        }
        return 'Now you can purchase a package to pay for the classes themselves. Click Per Class/Monthly Package  button to purchase package.';
    }
    purchasedSuccessfully = () =>{
        this.setState({enrollmentPackagesDialog:false});
        this.props.closeClassTypePackages && this.props.closeClassTypePackages(); 
        this.props.handleSignIn && this.props.handleSignIn()
        
    }
    render() {
        let { schoolId, classPricing, monthlyPricing, enrollmentFee, currency ,title} = this.props;

        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Class Packages"
                    open={this.props.open}
                    onClose={this.props.onClose}
                    onRequestClose={this.props.onClose}
                    aria-labelledby="Class Packages"
                >
                  {
            this.state.enrollmentPackagesDialog &&
            <EnrollmentPackagesDialogBox
              open={this.state.enrollmentPackagesDialog}
              schoolId={schoolId}
              onAddToCartIconButtonClick={this.handlePurchasePackage}
              onModalClose={() => {
                this.setState(state => {
                  return {
                    ...state,
                    enrollmentPackagesDialog: false,
                    selectedClassTypeIds: null
                  }
                })
              }}
              classTypeIds={this.state.selectedClassTypeIds}
              epData = {this.state.epData}
              currentPackageData = {this.state.currentPackageData}
            />
          }
                    {this.props.isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                          {title}
                            <IconButton color="primary" onClick={() => { this.props.onClose() }}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                        <PackagesList
                            schoolId={schoolId}
                            enrollMentPackages
                            onAddToCartIconButtonClick={this.handlePurchasePackage}
                            enrollMentPackagesData={enrollmentFee}
                            currency={currency}
                        />
                        <PackagesList
                            schoolId={schoolId}
                            onAddToCartIconButtonClick={this.handlePurchasePackage}
                            perClassPackagesData={classPricing}
                            currency={currency}
                        />
                        <PackagesList
                            schoolId={schoolId}
                            onAddToCartIconButtonClick={this.handlePurchasePackage}
                            monthlyPackagesData={normalizeMonthlyPricingData(monthlyPricing)}
                            currency={currency}
                        />
                    </DialogContent>
                    <DialogActions classes={{ root: this.props.classes.dialogActionsRoot }}>

                    </DialogActions>

                </Dialog>

            </MuiThemeProvider>
        )
    }
}


export default createContainer(props => {
    let { schoolId, classTypeId ,packagesRequired} = props;
	let slug = get(props.params,'slug',null);
    let schoolData, currency,classPricing = [],monthlyPricing = [],enrollmentFee = [],title;
    userBySchoolSubscription = Meteor.subscribe("UserSchoolbySlug", slug,schoolId);
    if (userBySchoolSubscription.ready()) {
        schoolData = School.findOne({ slug: slug });
        currency =
            schoolData && schoolData.currency
                ? schoolData.currency
                : config.defaultCurrency;
    }
    const currentUser = Meteor.user();
    title = 'Please purchase one of these package.';
    if(packagesRequired == 'enrollment'){
        Meteor.subscribe("enrollmentFee.getEnrollmentFee", { schoolId });
        enrollmentFee = EnrollmentFees.find({ schoolId, classTypeId }).fetch();
        title = 'Before purchasing any per class/monthly package covering this class you must purchase enrollment fee.';
    }
    else if(packagesRequired == "perClassAndMonthly"){
        Meteor.subscribe("classPricing.getClassPricing", { schoolId });
        Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId });
        classPricing = ClassPricing.find({ schoolId: schoolId, classTypeId }).fetch();
        monthlyPricing = MonthlyPricing.find({ schoolId: schoolId, classTypeId }).fetch();
    }
    else{
        Meteor.subscribe("classPricing.getClassPricing", { schoolId });
        Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId });
        Meteor.subscribe("enrollmentFee.getEnrollmentFee", { schoolId });
        enrollmentFee = EnrollmentFees.find({ schoolId, classTypeId }).fetch();
        classPricing = ClassPricing.find({ schoolId: schoolId, classTypeId }).fetch();
        monthlyPricing = MonthlyPricing.find({ schoolId: schoolId, classTypeId }).fetch();
    }
    return {
        schoolData,
        classPricing,
        monthlyPricing,
        enrollmentFee,
        currency,
        currentUser,
        title,
        packagesRequired,
        ...props
    };
}, withStyles(styles)(withPopUp(ClassTypePackages)));

