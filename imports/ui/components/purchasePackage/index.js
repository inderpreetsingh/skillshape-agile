
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
        let userId = get(this.props.currentUser,'_id',null);
        stripePaymentHelper.call(this, packageType, packageId, schoolId, packageName, amount, monthlyPymtDetails, expDuration, expPeriod, noClasses, planId, currency, pymtType, userId);
    } catch (error) {
        console.log('Error in handlePurchasePackage', error);
    }
}
render() {
    const {schoolId,packageType,currency,packageData,packageRequestData} = this.props;
    let userName,schoolName,className;
    if(!isEmpty(packageRequestData)){
      userName = packageRequestData.userName;
      schoolName= packageRequestData.schoolName;
      className = packageRequestData.className;
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
    const titleText = `${userName}, in order to attend <b>${className}</b> at school <b>${schoolName}</b>, you will need to pay for the package. After you pay one package fee associated with this class, below, you will be able to attend.`;
   return (<Root>
      <Title>
        {ReactHtmlParser(titleText)}
      </Title>
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
    packageDataSubscription = Meteor.subscribe(subscriptionName, { _id:packageId });
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
