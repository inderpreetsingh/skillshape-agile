import ClaimSchoolRequest from "./fields";
import { sendClaimASchoolEmail } from "/imports/api/email";
import { sendConfirmationEmail } from "/imports/api/email";
import School from "/imports/api/school/fields";
import { getUserFullName } from "/imports/util/getUserData";

Meteor.methods({
  "claimSchoolRequest.createClaimSchoolRequest": function(doc) {
    let currentUser = Meteor.users.findOne(doc.userId);
    let schoolData = School.findOne(doc.schoolId);
    // Check for PENDING OR REJECTED claim requests of current users if any and let them know the status of their request.
    const pendingClaimRequest = ClaimSchoolRequest.findOne({
      userId: doc.userId,
      status: "pending",
      schoolId: doc.schoolId
    });
    const rejectedClaimRequest = ClaimSchoolRequest.findOne({
      userId: doc.userId,
      status: "rejected",
      schoolId: doc.schoolId
    });
    // Claim request status is pending OR rejected.
    if (pendingClaimRequest) {
      return { pendingRequest: true };
    } else if (rejectedClaimRequest) {
      return { alreadyRejected: true };
    }
    // No school email exists then just Make the user Admin of that school by System.
    if (!schoolData.email && !schoolData.superAdmin) {
      let data = {};
      let schoolEmail = currentUser.emails && currentUser.emails[0].address;

      data.admins = [this.userId];
      data.superAdmin = this.userId;
      data.claimed = "Y";
      data.email = schoolEmail;
      doc.schoolEmail = schoolEmail;
      School.update({ _id: schoolData._id }, { $set: data });

      let x = Meteor.users.update(
        { _id: doc.userId },
        {
          $addToSet: {
            "profile.schoolId": { $each: [doc.schoolId] }
          }
        }
      );
      doc.status = "approved";
      doc.approvedBy = "superadmin";
      doc.createdAt = new Date();
      ClaimSchoolRequest.insert(doc);
      return { claimRequestApproved: true };
    } else {
      doc.userName = getUserFullName(currentUser);
      doc.createdAt = new Date();
      doc.status = "pending";
      let claimRequestId = ClaimSchoolRequest.insert(doc);
      let schoolAdminUser = Meteor.users.findOne({
        "emails.address": doc.schoolEmail
      });
      let manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&schoolRegister=true`;
      /*User is school Admin in this case we need to send that user to school admin page if user login otherwise
            let him login and then redirect to school admin page.*/
      if (schoolAdminUser) {
        manageBySelfUrl = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}&redirectUrl=SchoolAdmin/${
          doc.schoolId
        }/edit&type=reject`;
      }
      let ROOT_URL = `${Meteor.absoluteUrl()}?claimRequest=${claimRequestId}`;
      let schoolAdminRec = Meteor.users.findOne(schoolData.userId);

      /** Needs to handle these cases:
		1. Yes, make them an Admin, and keep me as SuperAdministrator.
		2. Yes, make them SuperAdministrator and keep me as an Administrator.
		3. Yes, make them SuperAdministrator and remove me as Administrator.
		4. No, deny their request.
		5. I have no idea what this is about.
	*/
      let modifyUsersRoles = {
        keepMeSuperAdmin: `${ROOT_URL}&keepMeSuperAdmin=true`,
        makeRequesterSuperAdmin: `${ROOT_URL}&makeRequesterSuperAdmin=true`,
        removeMeAsAdmin: `${ROOT_URL}&removeMeAsAdmin=true`
      };

      sendClaimASchoolEmail(
        doc,
        ROOT_URL,
        manageBySelfUrl,
        schoolAdminRec,
        schoolData,
        modifyUsersRoles
      );
      sendConfirmationEmail(currentUser, schoolData);
      return { emailSuccess: true };
    }
  },
  "claimSchoolRequest.approveSchoolClaimRequest": function(
    claimRequestId,
    status
  ) {
    if (!this.userId) {
      throw new Meteor.Error(
        "You need to login as a super admin of this school to approve the request"
      );
    }
    let claimRequestRec = ClaimSchoolRequest.findOne(claimRequestId);

    /*
             ***** `status` can be one of the following:****
             * Keep Me SuperAdmin and Make Requester Admin.
             * Keep me Admin and Make Requester Super Admin.
             * Make Requester Super Admin and remove me admin.
             * rejected.
             * approved.
         */
    let schoolData = School.findOne(claimRequestRec.schoolId);
   
    if (schoolData.superAdmin !== this.userId) {
      throw new Meteor.Error(
        "You need to login as a super admin of this school to approve the request"
      );
    } else if (claimRequestRec.status == "approved") {
      throw new Meteor.Error("This request has already been approved!");
    } else {
      schoolData && delete schoolData._id;
      let approveRequest = false;
      if (status && status.keepMeSuperAdmin) {
        // Just keep me as a Super Admin.
        schoolData.superAdmin = this.userId;
        // Make requester as an admin.
        let existingAdmins =
          schoolData.admins && schoolData.admins.length > 0
            ? schoolData.admins
            : [];
        existingAdmins.push(claimRequestRec.userId);
        schoolData.admins = existingAdmins;
        approveRequest = true;
      } else if (status && status.removeMeAsAdmin) {
        approveRequest = true;
        // Just Make Requester as a Super Admin and Remove me as an admin.
        schoolData.superAdmin = claimRequestRec.userId;
        if (claimRequestRec.userEmail) {
          schoolData.email = claimRequestRec.userEmail;
        }
        // Remove me as an admin.
        if (schoolData.admins && _.contains(schoolData.admins, this.userId)) {
          let index = schoolData.admins.indexOf(this.userId);
          let modifiedAdmins;
          // Remove me as an admin so just pull my user id from `admins` of `School` rec
          if (index > -1) {
            modifiedAdmins = schoolData.admins.filter(function(item) {
              return item !== schoolData.admins[index];
            });
          }
          schoolData.admins = modifiedAdmins;
          if (claimRequestRec.userEmail) {
            schoolData.email = claimRequestRec.userEmail;
          }
        }
      } else if (status && status.makeRequesterSuperAdmin) {
        approveRequest = true;
        // Make Requester Super Admin.
        schoolData.superAdmin = claimRequestRec.userId;
        // Make me as an admin.
        let existingAdmins =
          schoolData.admins && schoolData.admins.length > 0
            ? schoolData.admins
            : [];
        existingAdmins.push(claimRequestRec.userId);
        schoolData.admins = existingAdmins;
      } else if (!status) {
        // Just approve the request.
        approveRequest = true;
      }
      // Approve Request case:
      if (approveRequest) {
        // Needs to update role and Email in `Users` rec.
        School.update({ _id: claimRequestRec.schoolId }, { $set: schoolData });

        Meteor.users.update(
          { _id: claimRequestRec.userId },
          {
            $addToSet: {
              "profile.schoolId": { $each: [claimRequestRec.schoolId] }
            }
          }
        );

        ClaimSchoolRequest.update(
          { _id: claimRequestId },
          {
            $set: {
              status: "approved"
            }
          }
        );
        return { message: "Request has been approved!" };
      } else {
        // Just reject the request.
        ClaimSchoolRequest.update(
          { _id: claimRequestId },
          {
            $set: {
              status: "rejected"
            }
          }
        );
        return { message: "Request has been rejected!" };
      }
    }
  }
});
