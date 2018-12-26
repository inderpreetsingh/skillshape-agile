
import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import { withPopUp ,normalizeMonthlyPricingData,stripePaymentHelper} from '/imports/util';
import PackageRequest from '/imports/api/packagesRequest/fields.js';
import {get,isEmpty} from 'lodash';
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import School from "/imports/api/school/fields";
import styled from "styled-components";
import PackagesList from "/imports/ui/components/landing/components/class/packages/PackagesList.jsx";
import ReactHtmlParser from 'react-html-parser';
import { EnrollmentPackagesDialogBox } from '/imports/ui/components/landing/components/dialogs/';

const Root = styled.div`
`;
const Title =styled.div`
margin-bottom: 10px;
font-family: ' Comic Sans MS';
font-size: 22px;
text-align: center;
background-color: antiquewhite;
`;
class PurchasePackage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
handlePurchasePackage = async (packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType) => {
    try {
        stripePaymentHelper.call(this, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType);
    } catch (error) {
        console.log('Error in handlePurchasePackage', error);
    }
}
//After successful package purchase if the package is not EP mark that package on the class details page.
purchasedSuccessfully = () =>{
 const {packageRequestData:{userId,packageId,_id,packageType,classesId}} = this.props;
 let filter = {userId,_id:classesId};
 Meteor.call("purchases.getPurchasedFromPackageIds",[packageId],userId,(err,res)=>{
    if(res && !isEmpty(res)){
      Meteor.call("packageRequest.updateRecord",{doc_id:_id,doc:{valid:false}});
      Meteor.call('classes.updateClassData',filter,'signIn',res[0]._id,packageType,'purchasePackage');
    }   
 })
}
render() {
    const {schoolId,packageType,currency,packageData,packageRequestData} = this.props;
    let userName,schoolName,className,userId,titleText,userEmail,valid;

    if(!isEmpty(packageRequestData)){
      userName = packageRequestData.userName;
      schoolName= packageRequestData.schoolName;
      className = packageRequestData.className;
      userId = packageRequestData.userId;
      userEmail = packageRequestData.userEmail;
      valid = packageRequestData.valid;
    }
   
    if(userId != get(this.props.currentUser,'_id',null)){
      titleText = `You seems to be using different account.Please login with the <b>${userEmail} </b> `;
      return (  <Title>
        {ReactHtmlParser(titleText)}
      </Title>)
    }
    if(!valid){
      titleText = `You have purchased this package for class type <b>${className}</b>`;
      return (<Title>
        {ReactHtmlParser(titleText)}
      </Title>)
    }
    let enrollMentPackages=false,enrollMentPackagesData=[],perClassPackagesData=[],monthlyPackagesData=[];
    if(packageType=='MP'){
      monthlyPackagesData=packageData;
    }else if(packageType=='CP'){
      perClassPackagesData=packageData;
    }else{
      enrollMentPackagesData=packageData;
      enrollMentPackages=true;
    }
    titleText = `${userName}, in order to attend <b>${className}</b> at school <b>${schoolName}</b>, you will need to pay for the package. After you pay one package fee associated with this class, below, you will be able to attend.`;
   return (<Root>
      <Title>
        {ReactHtmlParser(titleText)}
      </Title>
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
            />
          }
      <PackagesList
        schoolId={schoolId}
        enrollMentPackages={enrollMentPackages}
        onAddToCartIconButtonClick={this.handlePurchasePackage}
        enrollMentPackagesData={enrollMentPackagesData}
        perClassPackagesData={perClassPackagesData}
        monthlyPackagesData={monthlyPackagesData}
        currency={currency}
      />
    </Root>
    )
  }
}
export default createContainer((props) => {
  let {packageRequestId} = props.params;
  let filter = {_id:packageRequestId};
  let packageRequestSubscription,packageRequestData,subscriptionName,
  packageId,packageDataSubscription,collectionName,packageData, 
  schoolData, currency,userBySchoolSubscription,schoolId,packageType;
  packageRequestSubscription= Meteor.subscribe("packageRequest.getInfoFromId",filter);
  if(packageRequestSubscription && packageRequestSubscription.ready()){
    packageRequestData = PackageRequest.findOne();
		if(!isEmpty(packageRequestData)){
    packageId = get(packageRequestData,"packageId",null);
    packageType = get(packageRequestData,"packageType",null);
    schoolId = get(packageRequestData,"schoolId",null);
    if(packageType=='MP'){
      subscriptionName = "monthlyPricing.getMonthlyPricingFromId";
      collectionName = MonthlyPricing;
    }else if(packageType=='CP'){
      subscriptionName = "classPricing.getClassPricingFromId";
      collectionName = ClassPricing;
    }else{
      subscriptionName = "enrollmentFee.getEnrollmentFeeFromId";
      collectionName = EnrollmentFees;
    }
    packageDataSubscription = Meteor.subscribe(subscriptionName, { _id:[packageId]});
   if(packageDataSubscription && packageDataSubscription.ready()){
    packageData = collectionName.find().fetch();
    if(packageType=='MP' && !isEmpty(packageData)){
      packageData = normalizeMonthlyPricingData(packageData);
    }
   }
   userBySchoolSubscription = Meteor.subscribe("UserSchoolbySlug", null,schoolId);
   if (userBySchoolSubscription.ready()) {
       schoolData = School.findOne({ _id:schoolId });
       currency =
           schoolData && schoolData.currency
               ? schoolData.currency
               : config.defaultCurrency;
   }
   
    }
  }
 
  return {
    ...props,
    packageData,
    packageRequestData,
    currency,
    schoolId,
    packageType,
    schoolData
  };
}, withPopUp(PurchasePackage));
