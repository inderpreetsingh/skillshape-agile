import PackageRequest, { PackageRequestSchema } from "./fields.js";
import { sendPackagePurchaseEmail ,sendPackageLink} from "/imports/api/email";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import School from "/imports/api/school/fields";
import { getUserFullName } from "/imports/util/getUserData";
import { check } from 'meteor/check';
import {get,isEmpty} from 'lodash';
Meteor.methods({
  "packageRequest.addRequest": function({ typeOfTable, tableId, schoolId }) {
    check(typeOfTable, String);
    check(tableId, String);
    check(schoolId, String);

    if (!typeOfTable || !tableId || !schoolId) {
      throw new Meteor.Error("Some fields missing!", "Error while purchasing");
    }
    const validationContext = PackageRequestSchema.newContext();
    if (this.userId) {
      let PricingTable = "";
      if (typeOfTable == "MP") {
        PricingTable = MonthlyPricing;
      } else if (typeOfTable == "CP") {
        PricingTable = ClassPricing;
      } else if (typeOfTable == "EP") {
        PricingTable = EnrollmentFees;
      }
      let packageData = PricingTable.findOne(tableId);
      const packageName =
        typeOfTable == "EP" ? packageData.name : packageData.packageName;
     
      const purchaseRequestAlreadyPresent = PackageRequest.findOne({
        userId: this.userId,
        packageId: packageData._id
      });
      const schoolData = School.findOne(schoolId);
      if (purchaseRequestAlreadyPresent) {
        throw new Meteor.Error(
          `You are currently unable to purchase this package from here. ${schoolData &&
            schoolData.name} has been notified of your interest in ${packageName} class package.`
        );
      } else {
        let data = {};
        data.packageId = packageData._id;
        data.userId = this.userId;
        data.schoolId = schoolId;
        data.createdAt = new Date();
        data.notification = true;

        const isValid = validationContext.validate(data);
        if (isValid) {
          PackageRequest.insert(data);
          let emailAddress = schoolData && schoolData.email;
          // School have no Email then need to send email to school admin.
          // if (!emailAddress) {
          //     let adminUser = Meteor.users.findOne({
          //         "profile.schoolId": schoolId
          //     });
          //     emailAddress = adminUser.emails[0].address;
          // }
          let adminUser = Meteor.users.findOne({
            "profile.schoolId": schoolId
          });
          let schoolAdminName = getUserFullName(adminUser);
          let currentUser = Meteor.users.findOne(this.userId);
          if (emailAddress) {
            sendPackagePurchaseEmail({
              to: emailAddress,
              buyer: currentUser.emails[0].address,
              packageName: packageName,
              schoolAdminName: schoolAdminName,
              schoolId: schoolId
            });
            return `You are currently unable to purchase this package from here. ${schoolData &&
              schoolData.name} has been notified of your interest in ${packageName} class package.`;
          }
        } else {
          // Return the errors in case something is invalid.
          const invalidData = validationContext.invalidKeys()[0];
          throw new Meteor.Error(invalidData.name + " is " + invalidData.value);
        }
      }
    } else {
      // User must be signed in to purchase packages.
      throw new Meteor.Error("Please login to purchase packages");
    }
  },
  "packageRequest.addRecord":function(data){
    check(data,Object);
    let {userId,packageId,classesId,valid} = data,record,result;
    record = PackageRequest.findOne(data);
    if(!isEmpty(record)){
     result = {status:false,record};
    }
    else{
      data.createdAt = new Date();
      record = PackageRequest.insert(data);
      result = {status:true,record};
      data.link='google.com'
      Meteor.call("packageRequest.sendPurchaseRequest",data);
    }
    return result;
  },
  "packageRequest.sendPurchaseRequest":function(data){
		console.log("​data", data)
    console.log('packageRequest.sendPurchaseRequest')
    let { userEmail, userName,  schoolName, className,link } = data;
    sendPackageLink({ userEmail, userName, link, schoolName, className });
  }
});
/* 
1. On send link entry in packageRequest Collection with info {userId,PackageId,classDetails_id,valid:true};
2. Send Email to that userEmailId.
3. Link in the email.
3. Click on link packagePurchase/packageRequest_id.
4. UI of package on the that page.
5. Update the class detail page purchase id field of that user.
6. Update packageRequest record with valid:false.
*/