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
import { withPopUp,stripePaymentHelper,normalizeMonthlyPricingData } from "/imports/util";
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
        
    }
   
    handlePurchasePackage = async ( packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType
        ) => {
          try {
            let userId = this.props.userId;
            stripePaymentHelper.call(this,packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType,userId);
          } catch (error) {
            console.log('Error in handlePurchasePackage', error);
          }
        };
    render() {
        let {schoolId, classPricing, monthlyPricing, enrollmentFee,currency} = this.props;
       
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Class Packages"
                    open={this.props.open}
                    onClose={this.props.onClose}
                    onRequestClose={this.props.onClose}
                    aria-labelledby="Class Packages"
                >
                    {this.props.isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                       Buy Packages

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
  let {schoolId,classTypeId} = props;
  const { slug } = props.params;
  let schoolData, currency;
  userBySchoolSubscription = Meteor.subscribe("UserSchoolbySlug", slug);
  if (userBySchoolSubscription.ready()) {
    schoolData = School.findOne({ slug: slug });
    currency =
      schoolData && schoolData.currency
        ? schoolData.currency
        : config.defaultCurrency;
  }
  Meteor.subscribe("classPricing.getClassPricing", { schoolId });
  Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId });
  Meteor.subscribe("enrollmentFee.getEnrollmentFee", { schoolId });
  const classPricing = ClassPricing.find({ schoolId: schoolId,classTypeId }).fetch();
  const monthlyPricing = MonthlyPricing.find({ schoolId: schoolId ,classTypeId}).fetch();
  const enrollmentFee = EnrollmentFees.find({ schoolId ,classTypeId}).fetch();
    return {
        schoolData,
        classPricing,
        monthlyPricing,
        enrollmentFee,
        currency
    };
  }, withStyles(styles)(withPopUp(ClassTypePackages)));
 
 