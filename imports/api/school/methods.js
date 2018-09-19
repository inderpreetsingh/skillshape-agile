import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import get from "lodash/get";
import ClassType from "/imports/api/classType/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import School from "./fields";
import { sendPackagePurchaseEmail,sendSkillShapeJoinInvitation } from "/imports/api/email";
import ClaimSchoolRequest from "/imports/api/claimSchoolRequest/fields.js";
import PriceInfoRequest from "/imports/api/priceInfoRequest/fields.js";
import { sendClaimASchoolEmail } from "/imports/api/email";
import { sendConfirmationEmail } from "/imports/api/email";
import { sendPriceInfoRequestEmail } from "/imports/api/email";
import { sendEmailToStudentForClaimAsMember,adminInvitation } from "/imports/api/email";
import { getUserFullName } from "/imports/util/getUserData";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";

Meteor.methods({
  editSchool: function(id, data) {
    console.log('TCL: data', data);
    let schoolData = School.findOne({ _id: id });
    if (schoolData && data.name && schoolData.name !== data.name) {
      ClassType.update(
        { schoolId: id },
        { $set: { "filters.schoolName": data.name } },
        { multi: true }
      );
    }
    return School.update({ _id: id }, { $set: data });
  },
  getClassesForMap: function({ schoolId }) {
    return {
      school: School.findOne({ _id: schoolId }),
      classTypes: ClassType.find({ schoolId }).fetch()
    };
  },
  "school.getConnectedSchool": function(userId) {
    let schoolList = [];
    const user = Meteor.users.findOne({ _id: userId });
    if (
      user &&
      user.profile &&
      user.profile.classIds &&
      user.profile.classIds.length > 0
    ) {
      classIds = user.profile.classIds;
      let demand = Demand.find({
        userId: userId,
        classId: { $in: classIds }
      });
      schoolList = demand.map(function(a) {
        return a.schoolId;
      });
    }
    return School.find({ _id: { $in: schoolList } }).fetch();
  },
  "school.getMySchool": function(schoolId,from) {
    if(schoolId){
        return School.findOne({_id:schoolId})
    }
    else if (this.userId && !from) {
      return School.find({ admins: { $in: [this.userId] } }).fetch();
    }
  },
  "school.claimSchool": function(userId, schoolId) {
    const data = {};
    data.userId = userId;
    data.claimed = "Y";
    School.update({ _id: schoolId }, { $set: data });
    return Meteor.users.update(
      { _id: data.userId },
      {
        $set: {
          "profile.schoolId": schoolId,
          "profile.acess_type": "school"
        }
      }
    );
  },
  "school.publishSchool": function({ schoolId, isPublish }) {
    ClassType.update(
      { schoolId: schoolId },
      { $set: { isPublish: isPublish } },
      { multi: true }
    );
    return School.update({ _id: schoolId }, { $set: { isPublish: isPublish } });
  },
  "school.purchasePackage": function({ typeOfTable, tableId, schoolId }) {
    // Do validation
    let PricingTable = "";
    if (!typeOfTable || !tableId || !schoolId) {
      throw new Meteor.Error("Some fields missing!", "Error while purchasing");
    }
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
    // if Email exists then send Email to School.
    let school = School.findOne(schoolId);
    let currentUser = Meteor.users.findOne(this.userId);
    let emailAddress = school && school.email;
    if (!emailAddress) {
      let adminUser = Meteor.users.findOne({
        "profile.schoolId": schoolId
      });
      emailAddress = adminUser.emails[0].address;
    }
    if (emailAddress) {
      sendPackagePurchaseEmail({
        packageName,
        to: emailAddress,
        buyer: currentUser.emails[0].address
      });
      return { emailSent: true };
    }
    return { emailSent: false };
  },
  "school.requestPricingInfo": function(schoolData) {
    if (this.userId && schoolData._id) {
      const schoolId = schoolData._id;
      // Check if reuest for this user already exist in DB then just update `notification` and send Email.
      const priceInfoRequest = PriceInfoRequest.findOne({
        schoolId,
        userId: this.userId
      });
      if (priceInfoRequest) {
        if (priceInfoRequest.notification) {
          throw new Meteor.Error(
            "You pricing request has already been created!!!"
          );
        }
        // Update `notification: true` in `PriceInfoRequest` so that duplicate entries not created for `PriceInfoRequest`;
        PriceInfoRequest.update(
          { _id: priceInfoRequest._id },
          { $set: { notification: true } }
        );
      } else {
        const requestObj = {
          schoolId,
          createdAt: new Date(),
          notification: true,
          userId: this.userId
        };
        PriceInfoRequest.insert(requestObj);

        let superAdminData;
        const currentUserData = Meteor.users.findOne({ _id: this.userId });
        const schoolOwnerData = Meteor.users.findOne({
          "profile.schoolId": schoolId
        });

        if (!schoolOwnerData) {
          superAdminData = Meteor.users.findOne({ roles: "Superadmin" });
        }
      }
      // Send Email to Admin of School if admin available
      const toEmail = "sam@skillshape.com"; // Needs to replace by Admin of School
      const fromEmail = "Notices@SkillShape.com";
      const updatePriceLink = `${Meteor.absoluteUrl()}SchoolAdmin/${
        schoolData._id
      }/edit`;
      let ownerName;
      if (schoolData && schoolData.userId) {
        // Get Admin of School As school Owner
        let adminUser = Meteor.users.findOne(schoolData.userId);
        ownerName = getUserFullName(adminUser);
      }
      if (!ownerName) {
        // Owner Name will be Sam
        ownerName = "Sam";
      }
      let currentUser = Meteor.users.findOne(this.userId);
      let currentUserName = getUserFullName(currentUser);
      sendPriceInfoRequestEmail({
        toEmail,
        fromEmail,
        updatePriceLink,
        ownerName,
        currentUserName
      });
      return { emailSent: true };
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  /*** This function is used to add a school member in `School`.
   * Here we check if user not exist then need to create new user and send invitation
   * to this user so that it can become active member by clicking on it.
   * if user is already a skillshape user then just make them as a member of School.
   */
  "school.addNewMember": function(doc) {
    // Validations
    const schoolAdminRec = Meteor.users.findOne({
      "profile.schoolId": doc.schoolId
    });
    const currentUserData = Meteor.users.findOne(this.userId);
    // Admin needs to login and should not be able to create members with their own email.
    if (!this.userId || !schoolAdminRec) {
      throw new Meteor.Error("You are not allowed to add a new member!!");
    } else if (
      currentUserData &&
      doc.email == currentUserData.emails[0].address
    ) {
      throw new Meteor.Error("You cannot add yourself as a member!!");
    } else {
      const userRecExist = Meteor.users.findOne({
        "emails.address": doc.email
      });
      let insertMember, memberDetail, newlyCreatedUser;
      // Not an active user in skillshape then need to create user and add them as a member of a particular class in a School.
      if (!userRecExist) {
        doc.sendMeSkillShapeNotification = true;
        doc.name = doc.firstName;
        newlyCreatedUser = Meteor.call("user.createUser", {
          ...doc,
          signUpType: "member-signup"
        });
        doc.activeUserId = newlyCreatedUser.user._id;
      } else {
        // User is already a member in skillshape then need to make them as a School member if they are not member in a Class.
        let filters = { email: doc.email, schoolId: doc.schoolId };

        if (isArray(doc.classIds)) {
          filters.classIds = { $in: doc.classIds };
        }

        memberDetail = SchoolMemberDetails.findOne(filters);

        if (!memberDetail) {
          doc.activeUserId =
            (userRecExist && userRecExist._id) ||
            (googleUserRec && googleUserRec._id);
        } else {
          insertMember = true;
        }
      }
      if (!insertMember) {
        doc.createdBy = this.userId;
        doc.inviteAccepted = false;
        // Create new member
        let memberId = SchoolMemberDetails.insert(doc);

        let claimingMemberRec = Meteor.users.findOne({ _id: doc.activeUserId });
        let password = newlyCreatedUser ? newlyCreatedUser.password : null;
        let fromEmail = "Notices@SkillShape.com";

        // To: can be from user's email OR from google services
        let toEmail =
          get(claimingMemberRec, "emails[0].address") ||
          get(claimingMemberRec, "google.services.email");

        let ROOT_URL = `${Meteor.absoluteUrl()}?acceptInvite=${true}&memberId=${memberId}&schoolId=${
          doc.schoolId
        }`;
        let rejectionUrl;
        // Active member found, then need to send notification to the member with a button to reject the school.
        if (!newlyCreatedUser) {
          rejectionUrl = `${Meteor.absoluteUrl()}?rejectInvite=${true}&memberId=${memberId}&schoolId=${
            doc.schoolId
          }`;
        }
        // const currentUserData = Meteor.users.findOne({ _id: this.userId });
        const schoolData = School.findOne(doc.schoolId);
        /*Need to send Email to User so that they get confirmation that their account has been
                linked as a member in School.*/
        sendEmailToStudentForClaimAsMember(
          currentUserData,
          schoolData,
          claimingMemberRec,
          password,
          fromEmail,
          toEmail,
          ROOT_URL,
          rejectionUrl,
          newlyCreatedUser
        );
        return { addedNewMember: true };
      } else {
        throw new Meteor.Error("Member Already exist!!");
      }
    }
  },
  // This is used to save admin notes in School Members.
  "school.saveAdminNotesToMember": function(doc) {
    // Validations
    // Only school admin can add a new Memeber.
    doc.updatedBy = this.userId;
    const schoolAdminRec = Meteor.users.findOne({
      "profile.schoolId": doc.schoolId
    });
    if (!schoolAdminRec) {
      return { accessDenied: true };
    }
    SchoolMemberDetails.update(
      { _id: doc.memberId },
      { $set: { adminNotes: doc.adminNotes } }
    );
    return { updatedNotes: true };
  },
  "school.updateInviteAcceptedToMemberRec": function({
    memberId,
    schoolId,
    acceptInvite
  }) {
    let schoolMemberDetails = SchoolMemberDetails.find({
      _id: memberId,
      schoolId: schoolId
    });
    let currentUser = Meteor.users.findOne(this.userId);
    let email =
      (currentUser.emails && currentUser.emails[0].address) ||
      currentUser.services.google.email;
    if (this.userId && schoolMemberDetails.email == email) {
      SchoolMemberDetails.update(
        { _id: memberId },
        { $set: { inviteAccepted: true } }
      );
    } else {
      return { memberLogin: false };
    }
    return { inviteAccepted: true };
  },
  "school.addNewSchool": function(doc) {
    const currentUser = doc || Meteor.users.findOne(this.userId);
    if (!this.userId) {
      throw new Meteor.Error("Access denied", "Error while adding new school");
    }
    const schoolInsertDoc = {
      email: currentUser.emails.address,
      isPublish: true,
      superAdmin: currentUser._id,
      admins: [currentUser._id],
      aboutHtml: "",
      descHtml: "",
      name: "my-school"
    };
    let schoolId = School.insert(schoolInsertDoc);
    // Needs to make current user admin of this School.
    Meteor.users.update(
      { _id: this.userId },
      {
        $addToSet: {
          "profile.schoolId": schoolId
        }
      }
    );
    let schoolEditViewLink = `${Meteor.absoluteUrl()}SchoolAdmin/${schoolId}/edit`;
    return schoolEditViewLink;
  },
  "school.addNewMemberWithoutEmail": function(doc) {
    const schoolAdminRec = Meteor.users.findOne({
      "profile.schoolId": doc.schoolId
    });
    const currentUserRec = Meteor.users.findOne({ _id: this.userId });
    let schoolIds = [];
    if (currentUserRec) {
      schoolIds = get(currentUserRec, "profile.schoolId");
    }
    // Member insertion is allowed only to School Admin.
    if (
      this.userId &&
      schoolAdminRec &&
      (schoolAdminRec._id == this.userId || _.contains(schoolIds, doc.schoolId))
    ) {
      doc.createdBy = this.userId;
      doc.inviteAccepted = false;
      let memberId = SchoolMemberDetails.insert(doc);
      return { addedNewMember: true };
    } else {
      throw new Meteor.Error("Access Denied!!!!");
    }
  },
  "school.findSuperAdmin": function(userId, slug, SchoolId) {
    let usersId;
    const filter = {superAdmin : userId || this.userId};
    if (slug) {
      filter.slug = slug;
    } else {
      filter._id = SchoolId;
    }
    let schoolData = School.findOne(filter);
    return !!schoolData;
  },
  "school.optimizationFinder": function () {
   return School.find({mainImage:{$exists:true},mainImageMedium:{$exists:false},mainImageLow:{$exists:false},logoImgMedium:{$exists:false},logoImgLow:{$exists:false}}).fetch();
  },
  "school.manageAdmin":function(_id,schoolId,action,to,userName,schoolName,payload){
    if(action=='remove'){
    let res=School.update({_id:schoolId},{$pull:{admins:_id}});
    adminInvitation(to,userName,schoolName,action)
    return res;
    }
    else if(action=='add'){
      let res=School.update({_id:schoolId},{$push:{admins:_id}});
      adminInvitation(to,userName,schoolName),action;
      return res;
    }
    else if(action =='join'){
      Meteor.call("user.createUser",payload,(err,res)=>{
        if(res){
          try{
            School.update({_id:schoolId},{$push:{admins:res.user._id}})
          sendSkillShapeJoinInvitation(to,userName,schoolName,res.password);
          }catch(error){
            console.log('TCL: }catch -> error', error);
            throw new Meteor.Error(error);
          }
         
        }
    })
    return 1;
    }
  }
});

/*name, email, userType, sendMeSkillShapeNotification*/
